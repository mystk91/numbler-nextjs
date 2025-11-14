"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./customGame.module.css";
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
import { createToast } from "@/app/components/toasts/createToast";
import InvalidGuess from "@/app/components/toasts/invalidGuessToast";
import { toast } from "react-toastify";
import { descramble } from "@/app/lib/descramble";
import Button from "@/app/components/buttons/Button Set/button";
import InputWrapper from "@/app/components/inputs/Text Input Wrapper - Trendy/input_wrapper";

type Digits = 2 | 3 | 4 | 5 | 6 | 7;

export type GameData = {
  values: Value[][];
  hints: Color[][];
  currentRow: number;
  correctNumber: string;
  gameStatus: `playing` | `victory` | `defeat`;
  date: Date;
  gameId: string;
};

/**
 *   Version of the game that lets you play random numbers, or choose a specific number to play.
 *   Only uses localStorage for scores, and doesn't do any backend tracking.
 *   This component was made by removing features from game.tsx, and adding a "create game" feature
 */
export default function Game() {
  const [gameboard, setGameboard] = useState<RowProps[]>([]);
  const currentRow = useRef(0);
  const currentColumn = useRef(0);
  const gameMode = useRef<`none` | `random` | `picked`>(`none`);
  const gameStatus = useRef<`playing` | `victory` | `defeat`>(`playing`);
  const correctNumber = useRef("");
  const [showEndPanel, setShowEndPanel] = useState(false);
  const { keyColors, setKeyColors } = useKeyColors();
  const initialKeyColors = useKeyColors().keyColors;
  const values = useRef<Value[][]>([]);
  const digits = useRef<Digits>(2);
  const hints = useRef<Color[][]>([]);
  const date = useRef<Date>(new Date());
  const gameId = useRef<string>(``);
  const scores = useRef<number[]>([]);
  const checkingGuess = useRef(false);
  const [focusEnter, setFocusEnter] = useState(false);
  // Stops infinite loops while logging out
  const isLoggingOut = useRef(false);
  // Used to change the Enter and Backpace key when the game is over to different buttons
  const [enterButton, setEnterButton] = useState<
    "Enter" | "Reset" | "Countdown"
  >("Enter");
  const [showScoresButton, setShowScoresButton] = useState(false);

  // State for form data and errors
  const form = {
    pickedNumber: "",
    randomNumber: "",
  };
  const [formData, setFormData] = useState(form);
  const [formErrors, setFormErrors] = useState(form);
  // Handle input changes
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  // Initalizes the game on mount
  async function initializeGame() {
    setShowEndPanel(false);
    setShowScoresButton(false);
    setEnterButton("Enter");
    setKeyColors(initialKeyColors);
    let scoresArr: number[] = [];
    const scoresStorage = localStorage.getItem("scores" + digits.current);
    if (scoresStorage) {
      try {
        scoresArr = JSON.parse(scoresStorage);
      } catch {
        scoresArr = [];
      }
    }
    scores.current = scoresArr;
    // Sets the refs used in the game
    const valuesArr = [];
    const hintsArr = [];
    for (let i = 0; i < 6; i++) {
      const valueRow: Value[] = [];
      const hintRow: Color[] = [];
      for (let j = 0; j < digits.current + 1; j++) {
        valueRow.push("");
        hintRow.push(`none`);
      }
      valuesArr.push(valueRow);
      hintsArr.push(hintRow);
    }
    values.current = valuesArr;
    hints.current = hintsArr;
    gameStatus.current = "playing";
    currentRow.current = 0;
    currentColumn.current = 0;
    checkingGuess.current = false;
    // Setting the number
    if (gameMode.current === "random") {
      let randomNumber = Math.floor(
        Math.random() * Math.pow(10, Number(formData.randomNumber))
      ).toString();
      while (randomNumber.length < digits.current) {
        randomNumber = "0" + randomNumber;
      }
      correctNumber.current = randomNumber;
    } else if (gameMode.current === "picked") {
      correctNumber.current = formData.pickedNumber.trim();
    }
    createGameboard();
  }

  //Creates the initial gameboard - helper function in initaizeGame
  function createGameboard() {
    const newBoard: RowProps[] = [];
    for (let i = 0; i < 6; i++) {
      const rectangles: RectangleProps[] = [];
      for (let j = 0; j < digits.current; j++) {
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
        value: values.current[i][digits.current],
        color: hints.current[i][digits.current],
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
    if (currentColumn.current < digits.current - 1) {
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
    } else if (currentColumn.current === digits.current - 1) {
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
    if (currentColumn.current > digits.current - 1) {
      setFocusEnter(true);
      setTimeout(() => setFocusEnter(false), 1);
    }
  }

  //Handles hitting the backspace key on the keyboard
  function handleBackspaceKey() {
    if (gameStatus.current !== "playing" || checkingGuess.current) return;
    toast.dismiss();
    if (currentColumn.current === digits.current) {
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
  }

  //Handles hitting the enter key on the keyboard
  async function handleEnterKey() {
    if (gameStatus.current !== "playing" || checkingGuess.current) return;
    if (currentColumn.current === digits.current) {
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
        `Enter a ${digits.current} digit number`,
        true,
        2000
      );
      toast.clearWaitingQueue();
    }
  }

  // Checks the guess of the user and handles the outcome
  async function checkGuess() {
    let guess = "";
    for (let i = 0; i < digits.current; i++) {
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
    const animation = animations[newHints[digits.current]];
    values.current[currentRow.current][digits.current] =
      directionalHint[newHints[digits.current]];
    //Here we update the current row rectangle graphics and the keyboard key graphics
    updateRectangle(currentRow.current, digits.current, {
      color: newHints[digits.current],
      value: values.current[currentRow.current][digits.current],
      animation: animation === "equals" ? "equals" : "",
      animate: true,
      currentRow: false,
    });
    const delayIncrement = Math.min(180, 800 / digits.current); //Lets our large digit versions go quicker
    let delay = 240;
    let oldRow = currentRow.current;
    for (let i = digits.current - 1; i > -1; i--) {
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
      localStorage.setItem(
        "scores" + digits.current,
        JSON.stringify(scores.current)
      );
      if (digits.current < 4) {
        if (digits.current == 2) {
          delay += 360;
        } else {
          delay += 160;
        }
      }
      setTimeout(() => {
        setShowEndPanel(true);
      }, delay + delayIncrement * digits.current - 200);
      // We will change the button and its function
      setTimeout(() => {
        setEnterButton("Reset");
        setShowScoresButton(true);
      }, delay + delayIncrement * digits.current + 300);
    } else {
      //Moving player to the next row
      currentRow.current += 1;
      currentColumn.current = 0;
      const newRowUpdate = Array.from(
        { length: digits.current + 1 },
        (_, i) => ({
          row: currentRow.current,
          column: i,
          updates: {
            animate: true,
            currentRow: true,
          },
        })
      );
      updateRectangle(currentRow.current, 0, {
        active: true,
      });
      setTimeout(() => updateRectangles(newRowUpdate), 90 * digits.current);
      setGameboard((prevGameboard) => {
        return prevGameboard.map((row, rowIndex) => {
          return {
            ...row,
            currentRow: rowIndex === currentRow.current,
          };
        });
      });
      checkingGuess.current = false;
    }
  }

  // Compares the guessed number with the corect number an returns an array of hints
  // These hints are used to determine what to do next
  function getHints(guess: string) {
    let newHints: Color[] = [];
    //Compares the number with target number and creates color hints for it
    let target = correctNumber.current;
    //let target = descramble(correctNumber.current);
    let tempTarget = "";
    for (let i = 0; i < digits.current; i++) {
      if (guess[i] === target[i]) {
        tempTarget += "G";
      } else {
        tempTarget += target[i];
      }
    }
    for (let i = 0; i < digits.current; i++) {
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
        for (let j = 0; j < digits.current; j++) {
          updateKeyColor(values.current[i][j] as Keys, hints.current[i][j]);
        }
      }
    }
  }

  function createRandomGame(e: React.FormEvent) {
    e.preventDefault();
    if (Number(formData.randomNumber) < 2) return;
    setFormErrors(form);
    gameMode.current = "random";
    digits.current = Number(formData.randomNumber) as Digits;
    initializeGame();
  }

  function createPickedGame(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors(form);
    // Validating the chosen number
    const errorFound =
      formData.pickedNumber
        .trim()
        .split(``)
        .some((number) => {
          return Number.isNaN(Number(number));
        }) || formData.pickedNumber.trim().length < 2;
    if (errorFound) {
      setFormErrors((prev) => ({
        ...prev,
        pickedNumber: "Choose a valid number",
      }));
      return;
    }
    digits.current = Number(formData.pickedNumber.trim().length) as Digits;
    gameMode.current = "picked";
    initializeGame();
    formData.pickedNumber = "";
  }

  return gameboard.length > 0 ? (
    //return false ? (
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
          Reset: () =>
            gameMode.current === "random" ? initializeGame() : setGameboard([]),
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
            correctNumber={correctNumber.current}
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
    <div className={styles.game_creator_wrapper}>
      <div className={styles.game_creator}>
        <h1>{`Create game`}</h1>
        <div className={styles.forms_wrapper}>
          <div className={styles.form_wrapper}>
            <h2>{`Random Number`}</h2>
            <form onSubmit={createRandomGame}>
              <select
                name="randomNumber"
                value={formData.randomNumber}
                onChange={handleChange}
              >
                <optgroup>
                  <option value={0}>{`Digits`}</option>
                  <option value={2}>{`2`}</option>
                  <option value={3}>{`3`}</option>
                  <option value={4}>{`4`}</option>
                  <option value={5}>{`5`}</option>
                  <option value={6}>{`6`}</option>
                  <option value={7}>{`7`}</option>
                </optgroup>
              </select>
              <Button
                variant="primary"
                width="smallest"
                type="submit"
                style={{ borderRadius: "0.4rem" }}
              >
                {`Start`}
              </Button>
            </form>
          </div>
          <div className={styles.form_wrapper}>
            <h2>{`Chosen Number`}</h2>
            <form onSubmit={createPickedGame}>
              <InputWrapper
                label="Choose a number"
                id="pickedNumber"
                name="pickedNumber"
                type="text"
                value={formData.pickedNumber}
                onChange={handleChange}
                error={formErrors.pickedNumber}
                ariaDescribedBy={
                  formErrors.pickedNumber ? `number-error` : undefined
                }
                maxLength={7}
              />
              <Button
                variant="primary"
                width="smallest"
                type="submit"
                style={{ borderRadius: "0.4rem" }}
              >
                {`Start`}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
