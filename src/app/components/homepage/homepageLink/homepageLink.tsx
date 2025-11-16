"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./homepageLink.module.css";
import classNames from "classnames";
import { Digits } from "@/app/components/game/game/game";
import Row from "@/app/components/game/row/row";
import { RectangleProps } from "@/app/components/game/rectangle/rectangle";
import { Color, Value } from "@/app/components/game/rectangle/rectangle";

interface HomepageLinkProps {
  digits: Digits;
  recommended?: boolean;
  style?: React.CSSProperties;
}

export default function HomepageLink({
  digits,
  recommended,
  style,
}: HomepageLinkProps) {
  const [gameboard, setGameboard] = useState<React.JSX.Element[]>([]);
  function createGameboard() {
    const newBoard: React.JSX.Element[] = [];
    const colorsArr: Record<string, Color[]> = {
      "2": ["green", "grey"],
      "3": ["green", "grey", "yellow"],
      "4": ["green", "grey", "yellow", "grey"],
      "5": ["green", "grey", "grey", "yellow", "grey"],
      "6": ["green", "yellow", "grey", "grey", "yellow", "grey"],
      "7": ["green", "grey", "yellow", "grey", "yellow", "grey", "grey"],
    };
    const valuesArr: Record<string, Value[]> = {
      "2": [2, 4],
      "3": [3, 1, 6],
      "4": [4, 3, 2, 1],
      "5": [5, 6, 1, 9, 0],
      "6": [6, 5, 3, 4, 2, 8],
      "7": [7, 4, 9, 3, 1, 4, 5],
    };
    const hintValues: Value[] = [
      "lower",
      "higher",
      "lower",
      "lower",
      "higher",
      "higher",
    ];
    const colorValues: Color[] = [
      "lower",
      "higher",
      "lower",
      "lower",
      "higher",
      "higher",
    ];
    for (let i = 0; i < 3; i++) {
      const rectangles: RectangleProps[] = [];
      for (let j = 0; j < digits; j++) {
        let digit: RectangleProps = {
          type: "digit",
          value:
            i === 0 || (i === 1 && j === 0)
              ? j === 0
                ? digits
                : valuesArr[digits.toString()][j]
              : "",
          color: i === 0 ? colorsArr[digits.toString()][j] : "none",
          animate: false,
          animation: ``,
          style: {
            minHeight: "unset",
            borderWidth: i === 1 && j === 1 ? "0.35rem" : "",
          },
          ariaLabel: "",
          currentRow: i === 1,
        };
        rectangles.push(digit);
      }
      let hint: RectangleProps = {
        type: "hint",
        value: i === 0 ? hintValues[digits - 2] : ``,
        color: i === 0 ? colorValues[digits - 2] : "none",
        active: false,
        animate: false,
        animation: ``,
        style: { minHeight: "unset" },
        ariaLabel: "",
        currentRow: i === 1,
      };
      rectangles.push(hint);
      newBoard.push(
        <Row
          rectangles={rectangles}
          row={i + 1}
          ariaLabel={""}
          style={{
            flex: "unset",
            height: `100%`,
            maxHeight: `${22 - digits}cqw`,
            width: "100%",
          }}
          key={i}
        />
      );
    }
    setGameboard(newBoard);
  }
  useEffect(() => {
    createGameboard();
  }, []);

  return (
    <Link
      href={`/digits${digits}`}
      style={{
        opacity: gameboard.length > 0 ? 1 : 0,
        ...style,
      }}
      className={styles.link}
      aria-label={`Go to the ${digits}-digit version of Numbler`}
    >
      <h2>{`${digits} Digits`}</h2>
      {recommended && <div className={styles.recommended}>{`Recommended`}</div>}
      <div
        className={styles.gameboard_wrapper}
        role="img"
        aria-label={`A Numbler gameboard for ${digits}-digits`}
      >
        {gameboard}
      </div>
    </Link>
  );
}
