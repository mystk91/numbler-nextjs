"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./endPanel.module.css";
import classNames from "classnames";
import Button from "@/app/components/buttons/Button Set/button";
import Rectangle from "@/app/components/game/rectangle/rectangle";
import Histogram from "@/app/components/game/histogram/histogram";
import { Color } from "@/app/components/game/rectangle/rectangle";
import NavbarButton from "../../buttons/navbarButton/navbarButton";

interface EndPanelProps {
  result: "victory" | "defeat";
  correctNumber: string;
  hints: Color[][];
  date: Date;
  scores: number[];
  closeFunction: () => void;
  style?: React.CSSProperties;
}
const gameModes = [2, 3, 4, 5, 6, 7];

export default function EndPanel({
  result,
  correctNumber,
  hints,
  date,
  scores,
  closeFunction,
}: EndPanelProps) {
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const [buttonClicked, setButtonClicked] = useState(false);

  function handleClick() {
    clearTimeout(timeoutRef.current);
    setButtonClicked(true);
    shareScore();
    timeoutRef.current = setTimeout(() => {
      setButtonClicked(false);
    }, 1750);
  }

  async function shareScore(): Promise<void> {
    const grey: string = `\u{2B1C}`;
    const green: string = `\u{1F7E9}`;
    const yellow: string = `\u{1F7E8}`;
    const equals: string = `\u{2705}`;
    const upArrow: string = `\u{2B06}`;
    const downArrow: string = `\u{2B07}`;
    const headerSpacesLeft: number[] = [0, 1, 2, 5, 7, 9];
    const bodySpacesLeft: number[] = [2, 1, 0, 0, 0, 0];
    const labelSpacesLeft: number[] = [1, 1, 3, 5, 7, 10];

    let copiedText: string = "";
    for (let i = 0; i < headerSpacesLeft[hints[0].length - 3]; i++) {
      copiedText += " ";
    }
    copiedText += "Numbler.net\n";

    let attempts: number = 1;
    hints.forEach((row: Color[]) => {
      for (let i = 0; i < bodySpacesLeft[hints[0].length - 3]; i++) {
        copiedText += " ";
      }

      for (let i = 0; i < row.length - 1; i++) {
        switch (row[i]) {
          case "grey": {
            copiedText += grey;
            break;
          }
          case "yellow": {
            copiedText += yellow;
            break;
          }
          default: {
            copiedText += green;
            break;
          }
        }
      }
      switch (row[row.length - 1]) {
        case "higher": {
          copiedText += upArrow + "\n";
          attempts++;
          break;
        }
        case "lower": {
          copiedText += downArrow + "\n";
          attempts++;
          break;
        }
        default: {
          copiedText += equals + "\n";
          break;
        }
      }
      if (!row) {
        for (let i = 0; i < hints[0].length - 1; i++) {
          copiedText += green;
        }
        copiedText += equals + "\n";
      }
    });
    for (let i = 0; i < labelSpacesLeft[hints[0].length - 3]; i++) {
      copiedText += " ";
    }
    copiedText += attempts + "/" + hints.length + " - ";
    copiedText += getDate();
    async function writeClipboardItem(text: BlobPart): Promise<void> {
      try {
        const clipboardItem: ClipboardItem = new ClipboardItem({
          "text/plain": new Blob([text], { type: "text/plain" }),
        });
        await navigator.clipboard.write([clipboardItem]);
      } catch (err) {}
    }
    await writeClipboardItem(copiedText);
  }

  //Gets the date in EST
  function getDate() {
    return date.toLocaleString("default", {
      timeZone: "America/New_York",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div
      className={styles.end_panel}
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
    >
      <button
        className={styles.close_button}
        onClick={closeFunction}
        aria-label={"Close panel"}
        tabIndex={2}
      >
        <svg
          id="close-icon"
          width="122.878px"
          height="122.88px"
          viewBox="0 0 122.878 122.88"
          className={styles.close_icon}
        >
          <g>
            <path d="M1.426,8.313c-1.901-1.901-1.901-4.984,0-6.886c1.901-1.902,4.984-1.902,6.886,0l53.127,53.127l53.127-53.127 c1.901-1.902,4.984-1.902,6.887,0c1.901,1.901,1.901,4.985,0,6.886L68.324,61.439l53.128,53.128c1.901,1.901,1.901,4.984,0,6.886 c-1.902,1.902-4.985,1.902-6.887,0L61.438,68.326L8.312,121.453c-1.901,1.902-4.984,1.902-6.886,0 c-1.901-1.901-1.901-4.984,0-6.886l53.127-53.128L1.426,8.313L1.426,8.313z" />
          </g>
        </svg>
      </button>
      <div className={styles.result}>
        {result === "victory" ? "Victory!" : "Defeat"}
      </div>
      <div className={styles.correct_number}>
        {correctNumber.split("").map((number, index) => (
          <Rectangle
            type="digit"
            value={parseInt(number) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}
            color={result === "victory" ? "green" : "none"}
            row={1}
            column={index}
            currentRow={true}
            animate={false}
            ariaLabel={`The correct number had a ${number} in column ${
              index + 1
            }`}
            key={index}
            style={{ flexShrink: "1" }}
          />
        ))}
      </div>
      <div className={styles.copy_button_wrapper}>
        <Button
          variant={"tertiary"}
          text={buttonClicked ? "Copied to Clipboard" : "Copy & Share"}
          onClick={handleClick}
          width="full"
          ariaLabel={
            buttonClicked
              ? "Copied to clipboard"
              : "Copy your game results to clipboard"
          }
          style={{
            fontSize: "2.rem",
            height: "4.8rem",
            cursor: buttonClicked ? "default" : "copy",
          }}
          tabIndex={1}
        />
      </div>
      <div className={styles.histogram_wrapper}>
        <Histogram scores={scores} numDigits={correctNumber.length} />
      </div>

      <div className={styles.game_modes}>
        <div className={styles.play_more}>{`Play More`}</div>
        <div className={styles.links_wrapper}>
          {gameModes.map((n) => (
            <Link
              key={n}
              href={`/digits${n}`}
              aria-label={`Go to the ${n} digit mode of Numbler`}
            >
              <NavbarButton
                style={{ backgroundColor: "var(--background)" }}
                tabIndex={-1}
              >
                <Rectangle
                  color="none"
                  type="digit"
                  value={
                    n as
                      | ""
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
                      | "equals"
                      | "higher"
                      | "lower"
                  }
                  style={{
                    border: "none",
                    backgroundColor: "var(--lower-color)",
                    minHeight: "5.2rem",
                  }}
                />
              </NavbarButton>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
