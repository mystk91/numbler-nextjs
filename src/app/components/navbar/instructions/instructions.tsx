"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./instructions.module.css";
import classNames from "classnames";
import Row from "@/app/components/game/row/row";
import Rectangle, {
  RectangleProps,
} from "@/app/components/game/rectangle/rectangle";

interface InstructionsProps {
  digits: "4" | "5";
  style?: React.CSSProperties;
}

const examples: Record<"4" | "5", (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)[]> = {
  "4": [4, 6, 1, 8],
  "5": [5, 3, 8, 1, 2],
};

const colors: Array<"none" | "grey" | "yellow" | "green"> = [
  "green",
  `yellow`,
  `grey`,
  `grey`,
  `grey`,
];

const digitHeight = `6.4rem`;

export default function Instructions({ digits, style }: InstructionsProps) {
  const createRow = (digits: number): RectangleProps[] => {
    const rectangles: RectangleProps[] = [];
    for (let i = 0; i < digits; i++) {
      rectangles.push({
        type: `digit`,
        value: ``,
        color: `none`,
        active: i === 0,
        currentRow: true,
        animate: false,
        animation: ``,
        animationDelay: 0,
      });
    }
    rectangles.push({
      type: `hint`,
      value: ``,
      color: `none`,
      active: false,
      currentRow: true,
      animate: false,
      animation: ``,
      animationDelay: 0,
    });
    return rectangles;
  };

  const [row, setRow] = useState<RectangleProps[]>(createRow(Number(digits)));
  // Helper function to update multiple rectangles at once
  const updateRectangles = (
    updates: { index: number; changes: Partial<RectangleProps> }[]
  ) => {
    setRow((prev) =>
      prev.map((rect, i) => {
        const update = updates.find((u) => u.index === i);
        return update ? { ...rect, ...update.changes } : rect;
      })
    );
  };

  //Plays the animation on mount, removes timeouts on dismount
  useEffect(() => {
    animate();
    return () => {
      clearTimeouts();
    };
  }, []);

  const timeouts = useRef<NodeJS.Timeout[]>([]);
  function addTimeout(fn: () => void, delay: number): void {
    const timeout = setTimeout(fn, delay);
    timeouts.current.push(timeout);
  }
  function clearTimeouts() {
    timeouts.current.forEach((timeout) => {
      clearTimeout(timeout);
    });
    timeouts.current = [];
  }

  //Handles the animation for the example row
  function animate() {
    clearTimeouts();
    setRow(createRow(Number(digits)));
    for (let i = 0; i < Number(digits) - 1; i++) {
      addTimeout(() => {
        updateRectangles([
          {
            index: i,
            changes: {
              value: examples[digits][i],
              active: false,
            },
          },
          {
            index: i + 1,
            changes: {
              active: true,
            },
          },
        ]);
      }, 500 + i * 400);
    }
    addTimeout(() => {
      updateRectangles([
        {
          index: Number(digits) - 1,
          changes: {
            value: examples[digits][Number(digits) - 1],
            active: false,
          },
        },
      ]);
    }, 500 + (Number(digits) - 1) * 400);
    addTimeout(() => {
      updateRectangles([
        {
          index: Number(digits),
          changes: {
            value: `lower`,
            color: `lower`,
            animate: true,
            currentRow: false,
          },
        },
      ]);
    }, 400 + Number(digits) * 400);
    addTimeout(() => {
      for (let i = Number(digits) - 1; i >= 0; i--) {
        addTimeout(() => {
          updateRectangles([
            {
              index: i,
              changes: {
                value: examples[digits][i],
                color: colors[i],
                currentRow: false,
                active: false,
                animate: true,
                animation: "bounce_down",
              },
            },
          ]);
        }, (i - Number(digits)) * -120);
      }
    }, 500 + Number(digits) * 400);
    addTimeout(() => {
      animate();
    }, 500 + Number(digits) * 400 + 15000);
  }

  return (
    row && (
      <div style={{ ...style }} className={styles.instructions}>
        <div className={styles.example_wrapper}>
          <h3>{`Guess the Number`}</h3>
          <div className={styles.row_wrapper}>
            <Row
              rectangles={row}
              currentRow={true}
              row={1}
              ariaLabel="Example Row"
              style={{ height: digitHeight }}
            />
          </div>
        </div>
        <div className={styles.instructions_wrapper}>
          <div
            className={styles.instruction_text}
          >{`Arrows Tell to Guess Higher or Lower`}</div>
          <div className={styles.arrows_wrapper}>
            <Rectangle
              type="hint"
              value="higher"
              color="higher"
              animate={false}
              currentRow={false}
              style={{ height: digitHeight }}
              row={2}
              column={1}
            />
            <Rectangle
              type="hint"
              value="lower"
              color="lower"
              animate={false}
              currentRow={false}
              style={{ height: digitHeight }}
              row={2}
              column={2}
            />
          </div>
        </div>
        <div className={styles.instructions_wrapper}>
          <div className={styles.instruction_text}>
            {`Colors Give Hints About the Digits`}
          </div>
          <div className={styles.color_hints}>
            <div className={styles.color_hint}>
              <Rectangle
                type="digit"
                value={examples[digits][0]}
                color="green"
                animate={false}
                currentRow={false}
                style={{ height: digitHeight }}
                row={3}
                column={1}
              />
              <div
                className={styles.text_wrapper}
              >{`Green digits are in the correct position`}</div>
            </div>
            <div className={styles.color_hint}>
              <Rectangle
                type="digit"
                value={examples[digits][1]}
                color="yellow"
                animate={false}
                currentRow={false}
                style={{ height: digitHeight }}
                row={4}
                column={1}
              />
              <div
                className={styles.text_wrapper}
              >{`Yellow digits are in the wrong position`}</div>
            </div>
            <div className={styles.color_hint}>
              <Rectangle
                type="digit"
                value={examples[digits][2]}
                color="grey"
                animate={false}
                currentRow={false}
                style={{ height: digitHeight }}
                row={5}
                column={1}
              />
              <div
                className={styles.text_wrapper}
              >{`Grey digits are not used again`}</div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
