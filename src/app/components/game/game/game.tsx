"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./game.module.css";
import classNames from "classnames";
import Gameboard from "@/app/components/game/gameboard/gameboard";
import Keyboard, {
  useKeyColors,
  Keys,
  KeyColors,
} from "@/app/components/game/keyboard/keyboard";
import EndPanel from "@/app/components/game/endPanel/endPanel";
import { RowProps } from "@/app/components/game/row/row";
import {
  RectangleProps,
  Color,
  Value,
  Animation,
} from "@/app/components/game/rectangle/rectangle";
import { useUser } from "@/app/contexts/userContext";
import { createToast } from "@/app/components/toasts/createToast";
import InvalidGuess from "@/app/components/toasts/invalidGuessToast";
import { toast } from "react-toastify";
import { descramble } from "@/app/lib/descramble";
import ArrowLoader from "@/app/components/loaders/arrow_loader";
import ExpectedError from "@/app/components/errors/Expected Error/error";

export type Digits = 2 | 3 | 4 | 5 | 6 | 7;

interface GameProps {
  digits: Digits;
}

export type GameData = {
  values: Value[][];
  hints: Color[][];
  currentRow: number;
  correctNumber: string;
  gameStatus: `playing` | `victory` | `defeat`;
  date: Date;
  gameId: string;
};

// Retrieves the users local storage
async function getLocalGameData(digits: number): Promise<GameData | null> {
  const storage = localStorage.getItem("digits" + digits);
  if (storage) {
    const object = JSON.parse(storage);
    return {
      values: object.values,
      hints: object.hints,
      currentRow: object.currentRow,
      correctNumber: object.correctNumber,
      gameStatus: object.gameStatus,
      date: object.date,
      gameId: object.gameId,
    };
  }
  return null;
}

// Refreshes the page - used when user has invalid credentials. Will force "user" to be reloaded
function forceLogout() {
  window.location.reload();
}

export default function Game({ digits }: GameProps) {
  const [gameboard, setGameboard] = useState<RowProps[]>([]);
  const currentRow = useRef(0);
  const currentColumn = useRef(0);
  const gameStatus = useRef<`playing` | `victory` | `defeat`>(`playing`);
  const [loading, setLoading] = useState(false);
  const correctNumber = useRef("");
  const [showEndPanel, setShowEndPanel] = useState(false);
  const { keyColors, setKeyColors } = useKeyColors();
  const initialKeyColors = useKeyColors().keyColors;
  const values = useRef<Value[][]>([]);
  const hints = useRef<Color[][]>([]);
  const date = useRef<Date>(new Date());
  const gameId = useRef<string>(``);
  const scores = useRef<number[]>([]);
  const checkingGuess = useRef(false);
  const [focusEnter, setFocusEnter] = useState(false);
  const [error, setError] = useState(false);
  // Stops infinite loops while logging out
  const isLoggingOut = useRef(false);
  // Used to change the Enter and Backpace key when the game is over to different buttons
  const [enterButton, setEnterButton] = useState<
    "Enter" | "Reset" | "Countdown"
  >("Enter");
  const [showScoresButton, setShowScoresButton] = useState(false);
  // Tells us that we have a logged in user
  const user = useUser();

  // Returns an object with all the data in the current game
  function getGameData() {
    return {
      values: values.current,
      hints: hints.current,
      currentRow: currentRow.current,
      correctNumber: correctNumber.current,
      gameStatus: gameStatus.current,
      date: date.current,
      gameId: gameId.current,
    };
  }

  //Initalizes the game
  useEffect(() => {
    initializeGame();

    // Stable handlers that check logout state
    const handleBlur = () => {
      if (!isLoggingOut.current) updateUserGame();
    };
    const handleBeforeUnload = () => {
      if (!isLoggingOut.current) updateUserGame();
    };

    window.addEventListener("focus", windowFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("focus", windowFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Re-initalizes the game when user swaps windows
  async function windowFocus() {
    if (gameStatus.current === "playing") {
      checkingGuess.current = true;
      await initializeGame();
      checkingGuess.current = false;
    }
  }

  // Updates the game on the backend for logged in users
  // We use "if (user)"" to either do this or handle data with localStorage
  // We need to input the score when the game ends
  async function updateGame(score?: number) {
    try {
      const res = await fetch("/api/game/updateGame", {
        method: "POST",
        body: JSON.stringify({
          digits: digits,
          score: score,
          game: getGameData(),
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error && data.logout) {
        isLoggingOut.current = true;
        forceLogout();
      }
    } catch {}
  }

  // Wrapper function for updateGame that checks if we have a user first - used in events
  async function updateUserGame(score?: number) {
    if (user && gameStatus.current === "playing" && !isLoggingOut.current) {
      await updateGame(score);
    }
  }

  // Initalizes the game on mount
  async function initializeGame() {
    try {
      setError(false);
      setShowEndPanel(false);
      setShowScoresButton(false);
      setEnterButton("Enter");
      // Here we need to decide if we're
      // loading user game data, local storage game data, or just creating an empty game
      let game: GameData | null = null;
      let scoresArr: number[] = [];
      let shouldFetch = true;
      const body: { digits: number; game?: GameData } = {
        digits: digits,
      };
      if (!user) {
        try {
          game = await getLocalGameData(digits);
        } catch {
          game = null;
        }
        const scoresStorage = localStorage.getItem("scores" + digits);
        if (scoresStorage) {
          try {
            scoresArr = JSON.parse(scoresStorage);
          } catch {
            scoresArr = [];
          }
        }
        if (game && game.gameStatus === "playing") {
          shouldFetch = false;
        } else {
          body.game = game as GameData;
        }
      }
      if (shouldFetch) {
        setLoading(true);
        try {
          const res = await fetch("/api/game/getGame", {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          if (data.game) {
            game = data.game;
          } else if (data.error && data.logout) {
            forceLogout();
          }
          if (data.scores) {
            scoresArr = data.scores;
          }
        } catch {}
      }
      if (game) {
        values.current = game.values;
        hints.current = game.hints;
        currentRow.current = game.currentRow;
        currentColumn.current = Math.max(
          game.values[game.currentRow].findIndex((value) => value === ""),
          0
        );
        gameStatus.current = game.gameStatus;
        gameId.current = game.gameId;
        correctNumber.current = game.correctNumber;
        scores.current = scoresArr;
        if (gameStatus.current !== "playing") {
          currentColumn.current = digits;
          updateKeyColors(currentRow.current + 1);
          setShowEndPanel(true);
          setEnterButton("Countdown");
          setShowScoresButton(true);
        } else {
          updateKeyColors(currentRow.current);
        }
        checkingGuess.current = false;
        createGameboard();
      }
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }

  //Creates the initial gameboard - helper function in initaizeGame
  function createGameboard() {
    const newBoard: RowProps[] = [];
    for (let i = 0; i < 6; i++) {
      const rectangles: RectangleProps[] = [];
      for (let j = 0; j < digits; j++) {
        let digit: RectangleProps = {
          type: "digit",
          value: values.current[i][j],
          color: hints.current[i][j],
          active: j === currentColumn.current && i === currentRow.current,
          animate: false,
          animation: ``,
          currentRow: currentRow.current === i,
        };
        rectangles.push(digit);
      }
      let hint: RectangleProps = {
        type: "hint",
        value: values.current[i][digits],
        color: hints.current[i][digits],
        active: false,
        animate: false,
        animation: ``,
        currentRow: currentRow.current === i,
      };
      rectangles.push(hint);
      newBoard.push({
        rectangles: rectangles,
        row: i + 1,
        currentRow: currentRow.current === i,
      });
    }
    setGameboard(newBoard);
  }

  //Updates one rectangle
  function updateRectangle(
    row: number,
    column: number,
    updates: Partial<RectangleProps>
  ) {
    setGameboard((prevGameboard) => {
      return prevGameboard.map((rowData, rowIndex) => {
        if (rowIndex === row) {
          return {
            ...rowData,
            rectangles: rowData.rectangles.map((rectangle, colIndex) => {
              if (colIndex === column) {
                return {
                  ...rectangle,
                  ...updates,
                };
              }
              return rectangle;
            }),
          };
        }
        return rowData;
      });
    });
  }
  //Used to update multiple rectangles at once
  function updateRectangles(
    changes: Array<{
      row: number;
      column: number;
      updates: Partial<RectangleProps>;
    }>
  ) {
    setGameboard((prevGameboard) => {
      return prevGameboard.map((row, rowIndex) => {
        return {
          ...row,
          rectangles: row.rectangles.map((rectangle, colIndex) => {
            const change = changes.find(
              (change) => change.row === rowIndex && change.column === colIndex
            );
            if (change) {
              return {
                ...rectangle,
                ...change.updates,
              };
            }
            return rectangle;
          }),
        };
      });
    });
  }

  //Handles pressing a number key on the keyboard
  function handleNumberKey(number: Value) {
    toast.dismiss();
    if (gameStatus.current !== "playing" || checkingGuess.current) return;
    if (currentColumn.current < digits - 1) {
      values.current[currentRow.current][currentColumn.current] = number;
      currentColumn.current += 1;
      updateRectangles([
        {
          row: currentRow.current,
          column: currentColumn.current - 1,
          updates: {
            value: number,
            active: false,
          },
        },
        {
          row: currentRow.current,
          column: currentColumn.current,
          updates: {
            active: true,
          },
        },
      ]);
    } else if (currentColumn.current === digits - 1) {
      values.current[currentRow.current][currentColumn.current] = number;
      currentColumn.current += 1;
      updateRectangles([
        {
          row: currentRow.current,
          column: currentColumn.current - 1,
          updates: {
            value: number,
            active: false,
          },
        },
      ]);
    }
    // This will make it so Enter always focuses when the digits are full
    if (currentColumn.current > digits - 1) {
      setFocusEnter(true);
      setTimeout(() => setFocusEnter(false), 1);
    }
    if (!user) {
      localStorage.setItem("digits" + digits, JSON.stringify(getGameData()));
    }
  }

  //Handles hitting the backspace key on the keyboard
  function handleBackspaceKey() {
    if (gameStatus.current !== "playing" || checkingGuess.current) return;
    toast.dismiss();
    if (currentColumn.current === digits) {
      currentColumn.current -= 1;
      values.current[currentRow.current][currentColumn.current] = "";
      updateRectangles([
        {
          row: currentRow.current,
          column: currentColumn.current,
          updates: {
            value: "",
            active: true,
          },
        },
      ]);
      setFocusEnter(false);
    } else if (currentColumn.current > 0) {
      currentColumn.current -= 1;
      values.current[currentRow.current][currentColumn.current] = "";
      updateRectangles([
        {
          row: currentRow.current,
          column: currentColumn.current,
          updates: {
            value: "",
            active: true,
          },
        },
        {
          row: currentRow.current,
          column: currentColumn.current + 1,
          updates: {
            active: false,
          },
        },
      ]);
    }
    if (!user) {
      localStorage.setItem("digits" + digits, JSON.stringify(getGameData()));
    }
  }

  //Handles hitting the enter key on the keyboard
  async function handleEnterKey() {
    if (gameStatus.current !== "playing" || checkingGuess.current) return;
    if (currentColumn.current === digits) {
      checkingGuess.current = true;
      await checkGuess();
      if (gameStatus.current === "playing") {
        checkingGuess.current = false;
      }
    } else {
      showInvalidGuessToast();
    }
    setFocusEnter(false);
  }

  // Shows an error message telling user to guess a "n" digit numbe
  function showInvalidGuessToast() {
    // This condition stops toasts from appearing if they hit double enter after making a guess
    if (
      currentColumn.current > 0 ||
      (currentRow.current === 0 && currentColumn.current === 0)
    ) {
      createToast(
        InvalidGuess,
        "error",
        undefined,
        `Enter a ${digits} digit number`,
        true,
        2000
      );
      toast.clearWaitingQueue();
    }
  }

  // Checks the guess of the user and handles the outcome
  async function checkGuess() {
    let guess = "";
    for (let i = 0; i < digits; i++) {
      guess += values.current[currentRow.current][i];
    }
    const newHints = getHints(guess);
    hints.current[currentRow.current] = newHints;
    const animations: Record<Color, Animation> = {
      higher: "bounce_up",
      lower: "bounce_down",
      green: "equals",
      none: "",
      grey: "",
      yellow: "",
    };
    const directionalHint: Record<Color, Value> = {
      higher: "higher",
      lower: "lower",
      green: "equals",
      none: "",
      grey: "",
      yellow: "",
    };
    const animation = animations[newHints[digits]];
    values.current[currentRow.current][digits] =
      directionalHint[newHints[digits]];
    //Here we update the current row rectangle graphics and the keyboard key graphics
    updateRectangle(currentRow.current, digits, {
      color: newHints[digits],
      value: values.current[currentRow.current][digits],
      animation: animation === "equals" ? "equals" : "",
      animate: true,
      currentRow: false,
    });
    const delayIncrement = Math.min(180, 800 / digits); //Lets our large digit versions go quicker
    let delay = 240;
    let oldRow = currentRow.current;
    for (let i = digits - 1; i > -1; i--) {
      let randomDelay =
        animation === "equals" ? 0 : Math.floor(Math.random() * 160) - 80;
      setTimeout(
        () =>
          updateRectangle(oldRow, i, {
            color: newHints[i],
            value: values.current[oldRow][i],
            animation: animation,
            animate: true,
            currentRow: false,
          }),
        delay + randomDelay
      );
      setTimeout(() => {
        updateKeyColor(values.current[oldRow][i] as Keys, newHints[i]);
      }, delay + 315 + randomDelay);
      delay += delayIncrement;
    }
    // Checking if game is over
    if (animation === "equals") {
      gameStatus.current = "victory";
    } else if (currentRow.current === 5) {
      gameStatus.current = "defeat";
    }
    if (gameStatus.current === "victory" || gameStatus.current === "defeat") {
      const score =
        gameStatus.current === "victory" ? currentRow.current + 1 : 7;
      scores.current.push(score);
      if (user) {
        await updateGame(score);
      } else {
        localStorage.setItem("digits" + digits, JSON.stringify(getGameData()));
        localStorage.setItem("scores" + digits, JSON.stringify(scores.current));
      }
      if (digits < 4) {
        if (digits == 2) {
          delay += 360;
        } else {
          delay += 160;
        }
      }
      setTimeout(() => {
        setShowEndPanel(true);
      }, delay + delayIncrement * digits - 200);
      // Checks for new game and updates statistics
      try {
        const res = await fetch("/api/game/finishGame", {
          method: "POST",
          body: JSON.stringify({
            digits: digits,
            score: score,
            values: values.current,
            gameId: gameId.current,
          }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        // We will change the button and its function
        setTimeout(() => {
          if (data.newGame === true) {
            setEnterButton("Reset");
            setShowScoresButton(true);
          } else {
            setEnterButton("Countdown");
            setShowScoresButton(true);
          }
        }, delay + delayIncrement * digits + 200);
      } catch {}
    } else {
      //Moving player to the next row
      currentRow.current += 1;
      currentColumn.current = 0;
      const newRowUpdate = Array.from({ length: digits + 1 }, (_, i) => ({
        row: currentRow.current,
        column: i,
        updates: {
          animate: true,
          currentRow: true,
        },
      }));
      updateRectangle(currentRow.current, 0, {
        active: true,
      });
      setTimeout(() => updateRectangles(newRowUpdate), 90 * digits);
      setGameboard((prevGameboard) => {
        return prevGameboard.map((row, rowIndex) => {
          return {
            ...row,
            currentRow: rowIndex === currentRow.current,
          };
        });
      });
      checkingGuess.current = false;
      // We update the user's game on the backend here
      if (user) {
        await updateGame();
      } else {
        localStorage.setItem("digits" + digits, JSON.stringify(getGameData()));
      }
    }
  }

  // Compares the guessed number with the corect number an returns an array of hints
  // These hints are used to determine what to do next
  function getHints(guess: string) {
    let newHints: Color[] = [];
    //Compares the number with target number and creates color hints for it
    //let target = correctNumber.current;
    let target = descramble(correctNumber.current);
    let tempTarget = "";
    for (let i = 0; i < digits; i++) {
      if (guess[i] === target[i]) {
        tempTarget += "G";
      } else {
        tempTarget += target[i];
      }
    }
    for (let i = 0; i < digits; i++) {
      if (tempTarget[i] === "G") {
        newHints.push("green");
      } else if (tempTarget.includes(guess[i])) {
        newHints.push("yellow");
      } else {
        newHints.push("grey");
      }
    }
    //Compares the number with target number numerically and creates a hint
    const targetNumber = Number(target);
    const guessNumber = Number(guess);
    if (guessNumber > targetNumber) {
      newHints.push("lower");
    } else if (guessNumber < targetNumber) {
      newHints.push("higher");
    } else if (guessNumber === targetNumber) {
      newHints.push("green");
    }
    return newHints;
  }

  // Used to change the color of a key after a guess is made
  function updateKeyColor(key: Keys, hint: Color) {
    setKeyColors((prevKeys) => {
      const currentColor = prevKeys[key];
      const colorHierarchy: Color[] = ["green", "yellow", "grey", "none"];
      const newColor =
        colorHierarchy.findIndex((value) => value === currentColor) <
        colorHierarchy.findIndex((value) => value === hint)
          ? currentColor
          : hint;
      return {
        ...prevKeys,
        [key]: newColor,
      };
    });
  }

  // Used to change the key colors when we load an old game - used during initializeGame()
  function updateKeyColors(row: number) {
    setKeyColors(initialKeyColors);
    if (currentRow.current > 0) {
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < digits; j++) {
          updateKeyColor(values.current[i][j] as Keys, hints.current[i][j]);
        }
      }
    }
  }

  return gameboard.length > 0 ? (
    <div className={styles.game}>
      <Gameboard rows={gameboard} />
      <Keyboard
        keyColors={keyColors}
        keyFunctions={{
          "0": () => handleNumberKey(0),
          "1": () => handleNumberKey(1),
          "2": () => handleNumberKey(2),
          "3": () => handleNumberKey(3),
          "4": () => handleNumberKey(4),
          "5": () => handleNumberKey(5),
          "6": () => handleNumberKey(6),
          "7": () => handleNumberKey(7),
          "8": () => handleNumberKey(8),
          "9": () => handleNumberKey(9),
          Enter: () => handleEnterKey(),
          Backspace: () => handleBackspaceKey(),
          Countdown: () => {},
          Reset: () => initializeGame(),
          Scores: () => setShowEndPanel(!showEndPanel),
        }}
        focusEnter={focusEnter}
        showScoresButton={showScoresButton}
        enterButton={enterButton}
        endPanelOpen={showEndPanel}
      />
      {showEndPanel && (
        <div className={styles.end_panel_wrapper}>
          <EndPanel
            result={gameStatus.current === "victory" ? "victory" : "defeat"}
            correctNumber={descramble(correctNumber.current)}
            hints={hints.current}
            scores={scores.current}
            date={date.current}
            closeFunction={() => {
              setShowEndPanel(false);
            }}
          />
        </div>
      )}
    </div>
  ) : (
    <>
      {loading && (
        <div
          className={styles.loading_game}
          role="status"
          aria-label="Loading game..."
        >
          <ArrowLoader />
        </div>
      )}
      {error && (
        <ExpectedError
          reset={() => {
            setLoading(true);
            initializeGame();
          }}
        />
      )}
    </>
  );
}
