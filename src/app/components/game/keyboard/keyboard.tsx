"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./keyboard.module.css";
import classNames from "classnames";
import KeyboardButton from "@/app/components/buttons/keyboardButton/keyboardButton";
import Backspace from "@/app/components/icons/backspace";
import { timeToNextGame } from "@/app/lib/timeToNextGame";

//The color the keys will be
type KeyColor = "none" | "grey" | "yellow" | "green";
const keyList = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "Enter",
  "Backspace",
  "Reset",
  "Countdown",
  "Scores",
] as const;
export type Keys = (typeof keyList)[number];
export type KeyColors = {
  [key in Keys]: KeyColor;
};

//The click functions the keys will recieve
export type KeyFunctions = {
  [key in Keys]: () => void;
};

// Creates the keyboard for the game
interface KeyboardProps {
  keyColors: KeyColors;
  keyFunctions: KeyFunctions;
  focusEnter?: boolean; // If true, the Enter key will get focused
  enterButton?: "Enter" | "Reset" | "Countdown";
  showScoresButton?: boolean;
}

// A hook used by the game component to control the key colors
export function useKeyColors() {
  const [keyColors, setKeyColors] = useState<KeyColors>({
    0: "none",
    1: "none",
    2: "none",
    3: "none",
    4: "none",
    5: "none",
    6: "none",
    7: "none",
    8: "none",
    9: "none",
    Enter: "none",
    Backspace: "none",
    Reset: "none",
    Countdown: "none",
    Scores: "none",
  });
  return { keyColors, setKeyColors };
}

export default function Keyboard({
  keyColors,
  keyFunctions,
  focusEnter = false,
  enterButton = "Enter",
  showScoresButton = false,
}: KeyboardProps) {
  const keyboardRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<Keys, HTMLButtonElement | null>>({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
    Enter: null,
    Backspace: null,
  });
  const [resetKeyPressToken, setResetKeyPressToken] = useState(undefined);

  //Used to create a navigation map on the keyboard from pressing directional arrows
  const navigationMap: Record<
    Keys,
    { ArrowUp?: Keys; ArrowDown?: Keys; ArrowLeft?: Keys; ArrowRight?: Keys }
  > = {
    "1": { ArrowRight: "2", ArrowDown: "Enter" },
    "2": { ArrowLeft: "1", ArrowRight: "3", ArrowDown: "Enter" },
    "3": { ArrowLeft: "2", ArrowRight: "4", ArrowDown: "Enter" },
    "4": { ArrowLeft: "3", ArrowRight: "5", ArrowDown: "Enter" },
    "5": { ArrowLeft: "4", ArrowRight: "6", ArrowDown: "Enter" },
    "6": { ArrowLeft: "5", ArrowRight: "7", ArrowDown: "Enter" },
    "7": { ArrowLeft: "6", ArrowRight: "8", ArrowDown: "Enter" },
    "8": { ArrowLeft: "7", ArrowRight: "9", ArrowDown: "Backspace" },
    "9": { ArrowLeft: "8", ArrowRight: "0", ArrowDown: "Backspace" },
    "0": { ArrowLeft: "9", ArrowDown: "Backspace" },
    Enter: { ArrowLeft: "1", ArrowUp: "5", ArrowRight: "Backspace" },
    Reset: { ArrowLeft: "1", ArrowUp: "5", ArrowRight: "Backspace" },
    Backspace: { ArrowLeft: "Enter", ArrowUp: "8", ArrowRight: "0" },
  };
  //Focuses an adjacent key when user hits directional arrow
  function onButtonKeydown(
    e?: React.KeyboardEvent<HTMLButtonElement>,
    key?: Keys
  ) {
    if (!e || key === undefined) return;
    if (e.key === "Enter" && e.currentTarget.matches(":focus-visible")) {
      e?.stopPropagation();
    }
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      e.preventDefault();
      const nextKey =
        navigationMap[key][e.key as keyof (typeof navigationMap)[typeof key]];
      if (nextKey && buttonRefs.current[nextKey]) {
        buttonRefs.current[nextKey]?.focus();
        e.preventDefault();
      }
    } else if (e.key === "Escape") {
      e.currentTarget.blur();
      e.preventDefault();
    }
  }

  //Used to create a visual indication when user types a key to press a button
  const [tokens, setTokens] = useState<Record<Keys, number>>({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    Enter: 0,
    Backspace: 0,
    Countdown: 0,
    Reset: 0,
    Scores: 0,
  });

  function handleKeydown(e: KeyboardEvent) {
    if (!keyList.includes(e.key as Keys)) return;
    let tokenKey = e.key as Keys;
    setTokens((prev) => ({
      ...prev,
      [tokenKey]: (prev[tokenKey] ?? 0) + 1,
    }));
    if (
      keyboardRef.current &&
      keyboardRef.current.querySelector(":focus-visible")
    ) {
      buttonRefs.current[e.key as Keys]?.focus();
    }
  }

  // Adds keydown event
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  // Focuses the Enter key when we change the focusEnter prop to true
  useEffect(() => {
    if (focusEnter && keyboardRef.current?.contains(document.activeElement)) {
      setTimeout(() => {
        buttonRefs.current.Enter?.focus();
      }, 0);
    }
  }, [focusEnter]);

  // Needed to reset enterButton when user hits reset button so "Enter" doesn't execute as well
  useEffect(() => {
    if (enterButton === "Reset") {
      setTokens((prev) => ({
        ...prev,
        Enter: 0,
      }));
      buttonRefs.current.Enter?.focus();
    }
  }, [enterButton]);

  return (
    <div className={styles.keyboard} ref={keyboardRef} aria-label="Keyboard">
      <div className={styles.number_keys} aria-label="Number keys">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((i) => (
          <KeyboardButton
            key={i}
            backgroundColor={keyColors[i]}
            width={"smallest"}
            onClick={keyFunctions[i]}
            keyPressToken={tokens[i]}
            ref={(el) => {
              buttonRefs.current[i] = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, i)}
            tabIndex={1}
          >
            {i}
          </KeyboardButton>
        ))}
      </div>
      <div className={styles.input_keys} aria-label="Input keys">
        {enterButton === "Enter" && (
          <KeyboardButton
            backgroundColor={keyColors.Enter}
            style={{ minHeight: `4.8rem` }}
            width={"default"}
            onClick={keyFunctions[`Enter`]}
            keyPressToken={tokens.Enter}
            ref={(el) => {
              buttonRefs.current.Enter = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "Enter")}
            ariaLabel="Enter a guess!"
            keyType="enter"
            tabIndex={1}
          >
            {"Enter"}
          </KeyboardButton>
        )}
        {enterButton === "Reset" && (
          <KeyboardButton
            backgroundColor={keyColors.Reset}
            style={{ minHeight: `4.8rem`, aspectRatio: "27/5" }}
            width={"default"}
            onClick={keyFunctions[`Reset`]}
            keyPressToken={resetKeyPressToken}
            ref={(el) => {
              buttonRefs.current.Enter = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "Enter")}
            keyType="enter"
            tabIndex={1}
          >
            {"Play Newest Puzzle"}
          </KeyboardButton>
        )}
        {enterButton === "Countdown" && (
          <KeyboardButton
            backgroundColor={keyColors.Enter}
            style={{ minHeight: `4.8rem`, aspectRatio: "35/6" }}
            width={"default"}
            onClick={keyFunctions[`Countdown`]}
            ref={(el) => {
              buttonRefs.current.Enter = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "Enter")}
            ariaLabel="A new puzzle will be available tomorrow."
            keyType="enter"
            tabIndex={1}
          >
            {timeToNextGame()}
          </KeyboardButton>
        )}
        {!showScoresButton ? (
          <KeyboardButton
            backgroundColor="none"
            width={"smallest"}
            style={{ minHeight: `4.8rem` }}
            onClick={keyFunctions[`Backspace`]}
            icon={<Backspace />}
            keyPressToken={tokens.Backspace}
            ref={(el) => {
              buttonRefs.current.Backspace = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "Backspace")}
            ariaLabel="Backspace key"
            keyType="backspace"
            tabIndex={1}
          ></KeyboardButton>
        ) : (
          <KeyboardButton
            backgroundColor="none"
            width={"smallest"}
            style={{ minHeight: `4.8rem`, aspectRatio: "2 / 1" }}
            onClick={keyFunctions[`Scores`]}
            ref={(el) => {
              buttonRefs.current.Backspace = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "Backspace")}
            ariaLabel="Show Scores"
            tabIndex={1}
          >{`Scores`}</KeyboardButton>
        )}
      </div>
    </div>
  );
}
