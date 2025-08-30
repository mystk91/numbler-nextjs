"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./keyboard.module.css";
import classNames from "classnames";
import KeyboardButton from "@/app/components/buttons/keyboardButton/keyboardButton";
import Backspace from "@/app/components/icons/backspace";

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
  });
  return { keyColors, setKeyColors };
}

export default function Keyboard({
  keyColors,
  keyFunctions,
  focusEnter,
}: KeyboardProps) {
  const [initalized, setIntialized] = useState(false);
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

  //Used to create a visual indication when user keydown to press a button
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
  });
  function handleKeydown(e: KeyboardEvent) {
    if (!keyList.includes(e.key as Keys)) return;
    setTokens((prev) => ({
      ...prev,
      [e.key]: (prev[e.key as Keys] ?? 0) + 1,
    }));
    if (
      keyboardRef.current &&
      keyboardRef.current.querySelector(":focus-visible")
    ) {
      buttonRefs.current[e.key as Keys]?.focus();
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    setIntialized(true);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  // Focuses the Enter key when we change the focusEnter prop to true
  useEffect(() => {
    if (focusEnter) {
      setTimeout(() => {
        buttonRefs.current.Enter?.focus();
      }, 0);
    }
  }, [focusEnter]);

  return (
    initalized && (
      <div className={styles.keyboard} ref={keyboardRef} aria-label="Keyboard">
        <div className={styles.number_keys} aria-label="Number keys">
          <KeyboardButton
            backgroundColor={keyColors[1]}
            width={"smallest"}
            onClick={keyFunctions[`1`]}
            keyPressToken={tokens[1]}
            ref={(el) => {
              buttonRefs.current[1] = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "1")}
          >{`1`}</KeyboardButton>
          <KeyboardButton
            backgroundColor={keyColors[2]}
            width={"smallest"}
            onClick={keyFunctions[`2`]}
            keyPressToken={tokens[2]}
            ref={(el) => {
              buttonRefs.current[2] = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "2")}
          >{`2`}</KeyboardButton>
          <KeyboardButton
            backgroundColor={keyColors[3]}
            width={"smallest"}
            onClick={keyFunctions[`3`]}
            keyPressToken={tokens[3]}
            ref={(el) => {
              buttonRefs.current[3] = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "3")}
          >{`3`}</KeyboardButton>
          <KeyboardButton
            backgroundColor={keyColors[4]}
            width={"smallest"}
            onClick={keyFunctions[`4`]}
            keyPressToken={tokens[4]}
            ref={(el) => {
              buttonRefs.current[4] = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "4")}
          >{`4`}</KeyboardButton>
          <KeyboardButton
            backgroundColor={keyColors[5]}
            width={"smallest"}
            onClick={keyFunctions[`5`]}
            keyPressToken={tokens[5]}
            ref={(el) => {
              buttonRefs.current[5] = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "5")}
          >{`5`}</KeyboardButton>
          <KeyboardButton
            backgroundColor={keyColors[6]}
            width={"smallest"}
            onClick={keyFunctions[`6`]}
            keyPressToken={tokens[6]}
            ref={(el) => {
              buttonRefs.current[6] = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "6")}
          >{`6`}</KeyboardButton>
          <KeyboardButton
            backgroundColor={keyColors[7]}
            width={"smallest"}
            onClick={keyFunctions[`7`]}
            keyPressToken={tokens[7]}
            ref={(el) => {
              buttonRefs.current[7] = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "7")}
          >{`7`}</KeyboardButton>
          <KeyboardButton
            backgroundColor={keyColors[8]}
            width={"smallest"}
            onClick={keyFunctions[`8`]}
            keyPressToken={tokens[8]}
            ref={(el) => {
              buttonRefs.current[8] = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "8")}
          >{`8`}</KeyboardButton>
          <KeyboardButton
            backgroundColor={keyColors[9]}
            width={"smallest"}
            onClick={keyFunctions[`9`]}
            keyPressToken={tokens[9]}
            ref={(el) => {
              buttonRefs.current[9] = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "9")}
          >{`9`}</KeyboardButton>
          <KeyboardButton
            backgroundColor={keyColors[0]}
            width={"smallest"}
            onClick={keyFunctions[`0`]}
            keyPressToken={tokens[0]}
            ref={(el) => {
              buttonRefs.current[0] = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "0")}
          >{`0`}</KeyboardButton>
        </div>
        <div className={styles.input_keys} aria-label="Input keys">
          <KeyboardButton
            backgroundColor={keyColors.Enter}
            style={{minHeight: `4.8rem`}}
            width={"default"}
            onClick={keyFunctions[`Enter`]}
            keyPressToken={tokens.Enter}
            ref={(el) => {
              buttonRefs.current.Enter = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "Enter")}
            ariaLabel="Enter a guess!"
            keyType="enter"
          >{`Enter`}</KeyboardButton>
          <KeyboardButton
            backgroundColor="none"
            width={"smallest"}
            style={{ minHeight: `4.8rem`}}
            onClick={keyFunctions[`Backspace`]}
            icon={<Backspace />}
            keyPressToken={tokens.Backspace}
            ref={(el) => {
              buttonRefs.current.Backspace = el;
            }}
            onKeyDown={(e) => onButtonKeydown(e, "Backspace")}
            ariaLabel="Backspace key"
            keyType="backspace"
          ></KeyboardButton>
        </div>
      </div>
    )
  );
}
