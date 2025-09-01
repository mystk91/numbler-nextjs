"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import Gameboard from "@/app/components/game/gameboard/gameboard";
import { RowProps } from "@/app/components/game/row/row";
import { RectangleProps } from "@/app/components/game/rectangle/rectangle";
import Button from "@/app/components/buttons/Button Set/button";

export default function Page() {
  const numDigits = 7;
  const maxGuesses = 6;
  const [gameboard, setGameboard] = useState<RowProps[]>([]);

  function createGameboard() {
    const newBoard: RowProps[] = [];
    for (let i = 0; i < maxGuesses; i++) {
      const rectangles: RectangleProps[] = [];
      for (let j = 0; j < numDigits; j++) {
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

  useEffect(() => {
    createGameboard();
  }, []);

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

  function changeStuff() {
    updateRectangles([
      {
        row: 0,
        column: 2,
        updates: {
          color: "green",
          value: 4,
          animate: true,
          animation: "bounce_down",
        },
      },
    ]);
  }

  return (
    gameboard && (
      <div className={styles.page}>
        <Gameboard rows={gameboard} />
        <Button
          variant="primary"
          onClick={changeStuff}
          style={{ margin: "1.2rem" }}
        >{`Change stuff`}</Button>
      </div>
    )
  );
}
