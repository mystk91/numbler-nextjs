"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.css";
import Rectangle from "@/app/components/game/rectangle/rectangle";

// This is an example of our rectangle used in the game
export default function Page() {
  const [currentRow, setCurrentRow] = useState(false);

  const [active, setActive] = useState(false);

  type RectangleState = {
    value:
      | ``
      | 0
      | 1
      | 2
      | 3
      | 4
      | 5
      | 6
      | 7
      | 8
      | 9
      | `higher`
      | `lower`
      | `equals`;
    color: "none" | "green" | "higher" | "lower" | "grey" | "yellow";
    animation?: "" | "bounce_up" | "bounce_down" | "equals";
    animate?: boolean;
    currentRow?: boolean;
  };

  const [props, setProps] = useState<RectangleState>({
    value: ``,
    color: `none`,
    animation: ``,
    animate: false,
  });

  const [hint, setHint] = useState<RectangleState>({
    value: ``,
    color: `none`,
    animation: ``,
    animate: false,
    currentRow: true,
  });

  const [equals, setEquals] = useState<RectangleState>({
    value: ``,
    color: `none`,
    animation: ``,
    animate: false,
    currentRow: true,
  });

  const [correctDigit, setCorrectDigit] = useState<RectangleState>({
    value: 9,
    color: `none`,
    animation: ``,
    animate: false,
    currentRow: true,
  });

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <Rectangle
          type={`digit`}
          value={5}
          color={props.color}
          active={false}
          currentRow={true}
          animate={props.animate}
          animation={props.animation}
          style={{ minHeight: "6.0rem", minWidth: "4.0rem" }}
        />

        <Rectangle
          type={`digit`}
          value={``}
          color="none"
          active={active}
          currentRow={true}
          animate={false}
          animation=""
          style={{ minHeight: "6.0rem", minWidth: "4.0rem" }}
        />

        <Rectangle
          type={`digit`}
          value={4}
          color="grey"
          active={false}
          currentRow={false}
          animate={true}
          animation="bounce_down"
          style={{ minHeight: "6.0rem", minWidth: "4.0rem" }}
        />
        <Rectangle
          type={`digit`}
          value={6}
          color="yellow"
          active={false}
          currentRow={false}
          animate={true}
          animation="bounce_up"
          style={{ minHeight: "6.0rem", minWidth: "4.0rem" }}
        />
        <Rectangle
          type={`digit`}
          value={correctDigit.value}
          color={correctDigit.color}
          active={false}
          currentRow={correctDigit.currentRow}
          animate={true}
          animation={correctDigit.animation}
          animationDelay={1.5}
          style={{ minHeight: "6.0rem", minWidth: "4.0rem" }}
        />

        <Rectangle
          type={`digit`}
          value={``}
          color="none"
          active={false}
          currentRow={currentRow}
          animate={true}
          animation=""
          style={{ minHeight: "6.0rem", minWidth: "4.0rem" }}
        />

        <Rectangle
          type={`hint`}
          value={hint.value}
          color={hint.color}
          animate={hint.animate}
          currentRow={hint.currentRow}
          style={{ minHeight: "6.0rem", minWidth: "4.0rem" }}
        />
        <Rectangle
          type={`hint`}
          value={`lower`}
          color="lower"
          currentRow={true}
          animate={false}
          style={{ minHeight: "6.0rem", minWidth: "4.0rem" }}
        />
        <Rectangle
          type={`hint`}
          value={`equals`}
          color="green"
          currentRow={false}
          style={{ minHeight: "6.0rem", minWidth: "4.0rem" }}
        />
        <Rectangle
          type={`hint`}
          value={equals.value}
          color={equals.color}
          animate={equals.animate}
          animation={equals.animation}
          currentRow={equals.currentRow}
          style={{ minHeight: "6.0rem", minWidth: "4.0rem" }}
        />
      </div>
      <div className={styles.buttons}>
        <button
          onClick={() => {
            setCurrentRow(!currentRow);
          }}
        >{`Change current row`}</button>

        <button
          onClick={() => {
            setProps({
              color: `green`,
              animation: `bounce_up`,
              animate: true,
              value: ``,
            });
          }}
        >{`Guess!`}</button>

        <button
          onClick={() => {
            setActive(!active);
          }}
        >{`Active!`}</button>
        <button
          onClick={() => {
            setCorrectDigit({
              value: 9,
              color: `none`,
              animation: `equals`,
              animate: true,
              currentRow: true,
            });
          }}
        >{`Correct Digit!`}</button>

        <button
          onClick={() => {
            setHint({
              value: `higher`,
              color: `higher`,
              animation: ``,
              animate: true,
              currentRow: false,
            });
          }}
        >{`Show Hint!!`}</button>

        <button
          onClick={() => {
            setEquals({
              value: `equals`,
              color: `none`,
              animation: `equals`,
              animate: true,
              currentRow: false,
            });
          }}
        >{`Correct Hint!!`}</button>
      </div>
    </div>
  );
}
