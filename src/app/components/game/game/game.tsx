"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./game.module.css";
import classNames from "classnames";

interface GameProps {
  style?: React.CSSProperties;
}

export default function Game({ style }: GameProps) {
  //componentDidMount, runs when component mounts and returns on dismount
  useEffect(() => {
    return () => {};
  }, []);

  const currentRow = useRef(0);
  const gameStatus = useRef<`playing` | `victory` | `defeat`>(`playing`);

  //These are the ones we need, might not need the other ones
  type rectangleComponent = {
    type: `digit` | `hint`;
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
    color: `none` | `grey` | `yellow` | `green` | `higher` | `lower`;
    animation?: `` | `bounce_up` | `bounce_down` | `equals`;
    currentRow: boolean;
    row: number;
    column: number;
  };

  type rectangle = {
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
    color: `none` | `grey` | `yellow` | `green` | `higher` | `lower`;
  };

  return <div style={{ ...style }}></div>;
}
