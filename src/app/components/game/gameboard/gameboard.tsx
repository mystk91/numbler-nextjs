"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./gameboard.module.css";
import classNames from "classnames";
import Row from "@/app/components/game/row/row";
import { RowProps } from "@/app/components/game/row/row";

interface GameboardProps {
  rows: RowProps[];
}

export default function Gameboard({ rows }: GameboardProps) {
  return (
    <div
      className={styles.gameboard}
      style={{
        maxHeight: `min(100%, calc(100vw * ${rows.length * 5} / ${
          rows[0]?.rectangles.length * 4
        }))`,
      }}
      aria-label="Game board"
    >
      {rows.map((rowProps, index) => {
        return <Row key={index} {...rowProps} />;
      })}
    </div>
  );
}
