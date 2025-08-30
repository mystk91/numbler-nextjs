"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./game.module.css";
import classNames from "classnames";
import Gameboard from "@/app/components/game/gameboard/gameboard";
import Keyboard from "@/app/components/game/keyboard/keyboard";
import { useKeyColors } from "@/app/components/game/keyboard/keyboard";
import { RowProps } from "@/app/components/game/row/row";
import { RectangleProps } from "@/app/components/game/rectangle/rectangle";

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
  const gameStatus = useRef<`playing` | `victory` | `defeat`>(`playing`);
  const showEndPanel = useState(false);
  const { keyColors, setKeyColors } = useKeyColors();

  //Initalizes the game
  useEffect(() => {
    createGameboard();
  }, []);

  //Creates the board for the game
  function createGameboard() {
    const newBoard: RowProps[] = [];
    for (let i = 0; i < 6; i++) {
      const rectangles: RectangleProps[] = [];
      for (let j = 0; j < digits; j++) {
        let digit: RectangleProps = {
          type: "digit",
          value: ``,
          color: "none",
          active: false,
          animate: false,
          animation: ``,
        };
        rectangles.push(digit);
      }
      let hint: RectangleProps = {
        type: "hint",
        value: ``,
        color: "none",
        active: false,
        animate: false,
        animation: ``,
      };
      rectangles.push(hint);
      newBoard.push({
        rectangles: rectangles,
        row: i + 1,
        currentRow: false,
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
    const updatedGameboard = gameboard.map((row, rowIndex) => {
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
    setGameboard(updatedGameboard);
  }
  //Used to update multiple rectangles at once
  function updateRectangles(
    changes: Array<{
      row: number;
      column: number;
      updates: Partial<RectangleProps>;
    }>
  ) {
    const updatedGameboard = gameboard.map((row, rowIndex) => {
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
    setGameboard(updatedGameboard);
  }

  //Handles pressing a number key on the keyboard
  function handleNumberKey(number: string) {
    console.log(`you hit ${number}`);
  }
  //Handles hitting the enter key on the keyboard
  function handleEnterKey() {
    console.log(`guessing.... hope you got lucky!`);
  }
  //Handles hitting the backspace key on the keyboard
  function handleBackspaceKey() {
    console.log("you hit backspace");
  }

  return (
    gameboard && (
      <div className={styles.game}>
        <Gameboard rows={gameboard} />
        <Keyboard
          keyColors={keyColors}
          keyFunctions={{
            "0": () => handleNumberKey("0"),
            "1": () => handleNumberKey("1"),
            "2": () => handleNumberKey("2"),
            "3": () => handleNumberKey("3"),
            "4": () => handleNumberKey("4"),
            "5": () => handleNumberKey("5"),
            "6": () => handleNumberKey("6"),
            "7": () => handleNumberKey("7"),
            "8": () => handleNumberKey("8"),
            "9": () => handleNumberKey("9"),
            Enter: () => handleEnterKey(),
            Backspace: () => handleBackspaceKey(),
          }}
        />
      </div>
    )
  );
}
