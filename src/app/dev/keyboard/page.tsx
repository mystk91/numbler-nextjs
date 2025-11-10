"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useState } from "react";

import Keyboard, {
  KeyFunctions,
  useKeyColors,
} from "@/app/components/game/keyboard/keyboard";

export default function Page() {
  //Lets us change the keyboard key colors and assign a function to them
  const { keyColors, setKeyColors } = useKeyColors();
  const keyboardFuctions: KeyFunctions = {
    0: () => {
      console.log("0");
    },
    1: () => {
      console.log("1");
    },
    2: () => {
      console.log("2");
    },
    3: () => {
      console.log("3");
    },
    4: () => {
      console.log("4");
    },
    5: () => {
      console.log("5");
    },
    6: () => {
      console.log("6");
    },
    7: () => {
      console.log("7");
    },
    8: () => {
      console.log("8");
    },
    9: () => {
      console.log("9");
    },
    Enter: () => {
      console.log("Enter");
    },
    Backspace: () => {
      console.log("Backspace");
    },
    Reset: function (): void {
      console.log("Reset");
    },
    Countdown: function (): void {
      console.log("Countdown");
    },
    Scores: function (): void {
      console.log("Scores");
    },
  };

  function changeColors() {
    setTimeout(() => {
      setKeyColors((prev) => ({
        ...prev,
        4: "green",
      }));
    }, 1000);
    setTimeout(() => {
      setKeyColors((prev) => ({
        ...prev,
        5: "grey",
      }));
    }, 1500);
    setTimeout(() => {
      setKeyColors((prev) => ({
        ...prev,
        6: "yellow",
      }));
    }, 2000);
  }

  const [focusEnter, setFocusEnter] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <Keyboard
          keyColors={keyColors}
          keyFunctions={keyboardFuctions}
          focusEnter={focusEnter}
        />
        <button onClick={changeColors}>{`Change Colors`}</button>
        <button
          onClick={() => {
            setTimeout(() => setFocusEnter(true), 1000);
          }}
        >{`Focus Enter`}</button>
      </div>
    </div>
  );
}
