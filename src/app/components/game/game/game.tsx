"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
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

type Digits = 2 | 3 | 4 | 5 | 6 | 7;
interface User {
  session?: any;
}

interface GameProps {
  digits: Digits;
  user?: User;
}

export default function Game({ digits, user }: GameProps) {
  //componentDidMount, runs when component mounts and returns on dismount
  useEffect(() => {
    return () => {};
  }, []);

  const [gameboard, setGameboard] = useState<RowProps[]>([]);
  const currentRow = useRef(0);
  const currentColumn = useRef(0);
  const gameStatus = useRef<`playing` | `victory` | `defeat`>(`playing`);
  const correctNumber = useRef("");
  const [showEndPanel, setShowEndPanel] = useState(false);
  const { keyColors, setKeyColors } = useKeyColors();
  const values = useRef<Value[][]>([]);
  const hints = useRef<Color[][]>([]);
  const date = useRef<Date>(new Date());
  const scores = useRef<number[]>([]);
  const checkingGuess = useRef(false);
  const [focusEnter, setFocusEnter] = useState(false);

  //Initalizes the game
  useEffect(() => {
    initializeGame();
  }, []);

  // Initalizes the game on mount
  function initializeGame() {
    // Sets up the hints and values
    const valuesArr = [];
    const hintsArr = [];
    // Here we need to decide if we're loading user game data, local storage game data, or just creating an empty game
    // For now we will just create an empty game, but we need to implement the others
    for (let i = 0; i < 6; i++) {
      const valueRow: Value[] = [];
      const hintRow: Color[] = [];
      for (let j = 0; j < digits + 1; j++) {
        valueRow.push("");
        hintRow.push(`none`);
      }
      valuesArr.push(valueRow);
      hintsArr.push(hintRow);
    }
    currentRow.current = 0;
    gameStatus.current = "playing";
    values.current = valuesArr;
    hints.current = hintsArr;
    // We need to retrieve the correct number and date for the current puzzle
    // Just creating a random number for now
    date.current = new Date();
    let number = "";
    for (let i = 0; i < digits; i++) {
      number += Math.floor(Math.random() * 10);
    }
    correctNumber.current = number;
    console.log(number);
    createGameboard();
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
          active: j === 0 && currentRow.current === i,
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
    targetRow: number,
    targetColumn: number,
    updates: Partial<RectangleProps>
  ) {
    setGameboard((prevGameboard) => {
      return prevGameboard.map((row, rowIndex) => {
        if (rowIndex === targetRow) {
          return {
            ...row,
            rectangles: row.rectangles.map((rectangle, colIndex) => {
              if (colIndex === targetColumn) {
                return {
                  ...rectangle,
                  ...updates,
                };
              }
              return rectangle;
            }),
          };
        }
        return row;
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
      setFocusEnter(true);
    }
  }

  //Handles hitting the backspace key on the keyboard
  function handleBackspaceKey() {
    if (gameStatus.current !== "playing" || checkingGuess.current) return;
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
  }

  //Handles hitting the enter key on the keyboard
  function handleEnterKey() {
    if (gameStatus.current !== "playing" || checkingGuess.current) return;
    currentColumn.current === digits ? checkGuess() : showErrorMessage();
    setFocusEnter(false);
  }

  // Shows an error message telling user to guess a "n" digit numbe
  function showErrorMessage() {
    console.log(`you need to guess a ${digits} digit number`);
  }

  // Checks the guess of the user and handles the outcome
  function checkGuess() {
    checkingGuess.current = true;
    let guess = "";
    for (let i = 0; i < digits; i++) {
      guess += values.current[currentRow.current][i];
    }
    const newHints = getHints(guess);
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
    const delayIncrement = 180;
    let delay = 240;
    let oldRow = currentRow.current;
    for (let i = digits - 1; i > -1; i--) {
      setTimeout(
        () =>
          updateRectangle(oldRow, i, {
            color: newHints[i],
            value: values.current[oldRow][i],
            animation: animation,
            animate: true,
            currentRow: false,
          }),
        delay
      );
      setTimeout(() => {
        updateKeyColor(values.current[oldRow][i] as Keys, newHints[i]);
      }, delay + 315);
      delay += delayIncrement;
    }
    if (animation === "equals") {
      gameStatus.current = "victory";
    } else if (currentRow.current === 5) {
      gameStatus.current = "defeat";
    }
    if (gameStatus.current === "victory" || gameStatus.current === "defeat") {
      scores.current.push(
        gameStatus.current === "victory" ? currentRow.current + 1 : 7
      );
      setTimeout(() => {
        setShowEndPanel(true);
      }, delay + delayIncrement * digits);
    } else {
      currentRow.current += 1;
      currentColumn.current = 0;
      const newRowUpdate = Array.from({ length: digits + 1 }, (_, i) => ({
        row: currentRow.current,
        column: i,
        updates: {
          active: i === 0,
          animate: true,
          currentRow: true,
        },
      }));
      updateRectangles(newRowUpdate);
      checkingGuess.current = false;
    }
    setGameboard((prevGameboard) => {
      return prevGameboard.map((row, rowIndex) => {
        return {
          ...row,
          currentRow: rowIndex === currentRow.current,
        };
      });
    });
  }

  // Compares the guessed number with the corect number an returns an array of hints
  // These hints are used to determine what to do next
  function getHints(guess: string) {
    let newHints: Color[] = [];
    //Compares the number with target number and creates color hints for it
    let target = correctNumber.current;
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

  // Used to change the color of a key after a guess is made - also used on initalization for loaded games
  function updateKeyColor(key: Keys, hint: Color) {
    const currentColor = keyColors[key];
    const colorHierarchy: Color[] = ["green", "yellow", "grey", "none"];
    const newColor =
      colorHierarchy.findIndex((value) => value === currentColor) <
      colorHierarchy.findIndex((value) => value === hint)
        ? currentColor
        : hint;
    setKeyColors((prevKeys) => {
      return {
        ...prevKeys,
        [key]: newColor,
      };
    });
  }

  return (
    gameboard && (
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
          }}
          focusEnter={focusEnter}
        />
        {showEndPanel && (
          <div className={styles.end_panel_wrapper}>
            <EndPanel
              result={gameStatus.current === "victory" ? "victory" : "defeat"}
              correctNumber={correctNumber.current}
              hints={hints.current}
              scores={scores.current}
              date={date.current}
              closeFunction={() => setShowEndPanel(false)}
            />
          </div>
        )}
      </div>
    )
  );
}
