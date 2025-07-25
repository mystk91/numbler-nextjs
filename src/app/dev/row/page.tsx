"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import Row from "@/app/components/game/row/row";
import Rectangle from "@/app/components/game/rectangle/rectangle";

export function PageOne() {
  const guesses = 6;
  const columns = 6;
  return (
    <div className={styles.page}>
      <div
        className={styles.wrapper}
        style={{
          maxHeight: `min(100vh, calc(100vw * ${guesses * 5} / ${
            columns * 4
          }))`,
        }}
      >
        <Row
          rectangles={[
            {
              type: "digit",
              value: 4,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 2,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 8,
              color: "yellow",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 1,
              color: "green",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 9,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "hint",
              value: `lower`,
              color: "lower",
              active: false,
              animate: false,
              animation: ``,
            },
          ]}
          currentRow={false}
          row={1}
        />
        <Row
          rectangles={[
            {
              type: "digit",
              value: 6,
              color: "green",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 0,
              color: "yellow",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 3,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 2,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 4,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "hint",
              value: `higher`,
              color: "higher",
              active: false,
              animate: false,
              animation: ``,
            },
          ]}
          currentRow={false}
          row={2}
        />
        <Row
          rectangles={[
            {
              type: "digit",
              value: 4,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 2,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 8,
              color: "yellow",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 1,
              color: "green",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 9,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "hint",
              value: `lower`,
              color: "lower",
              active: false,
              animate: false,
              animation: ``,
            },
          ]}
          currentRow={false}
          row={3}
        />
        <Row
          rectangles={[
            {
              type: "digit",
              value: 4,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 2,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 8,
              color: "yellow",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 1,
              color: "green",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 9,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "hint",
              value: `lower`,
              color: "lower",
              active: false,
              animate: false,
              animation: ``,
            },
          ]}
          currentRow={false}
          row={4}
        />

        <Row
          rectangles={[
            {
              type: "digit",
              value: 1,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 5,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 3,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "hint",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
          ]}
          currentRow={true}
          row={5}
        />

        <Row
          rectangles={[
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "hint",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
          ]}
          currentRow={false}
          row={6}
        />
      </div>
    </div>
  );
}

export default function PageTwo() {
  const guesses = 6;
  const columns = 8;
  return (
    <div className={styles.page}>
      <div
        className={styles.wrapper}
        style={{
          height: `min(100%, calc(100vw * ${guesses * 5} / ${columns * 4}))`,
        }}
      >
        <Row
          rectangles={[
            {
              type: "digit",
              value: 4,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 2,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 8,
              color: "yellow",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 1,
              color: "green",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 9,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 9,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 9,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "hint",
              value: `lower`,
              color: "lower",
              active: false,
              animate: false,
              animation: ``,
            },
          ]}
          currentRow={false}
          row={1}
        />
        <Row
          rectangles={[
            {
              type: "digit",
              value: 6,
              color: "green",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 0,
              color: "yellow",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 3,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 2,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 4,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 4,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 4,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "hint",
              value: `higher`,
              color: "higher",
              active: false,
              animate: false,
              animation: ``,
            },
          ]}
          currentRow={false}
          row={2}
        />
        <Row
          rectangles={[
            {
              type: "digit",
              value: 4,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 2,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 8,
              color: "yellow",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 1,
              color: "green",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 9,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 9,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 9,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "hint",
              value: `lower`,
              color: "lower",
              active: false,
              animate: false,
              animation: ``,
            },
          ]}
          currentRow={false}
          row={3}
        />
        <Row
          rectangles={[
            {
              type: "digit",
              value: 4,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 2,
              color: "grey",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 8,
              color: "yellow",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 1,
              color: "green",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 9,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 9,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: 9,
              color: "grey",
              active: true,
              animate: false,
              animation: ``,
            },
            {
              type: "hint",
              value: `lower`,
              color: "lower",
              active: false,
              animate: false,
              animation: ``,
            },
          ]}
          currentRow={false}
          row={4}
        />

        <Row
          rectangles={[
            {
              type: "digit",
              value: 1,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
              currentRow: true,
            },
            {
              type: "digit",
              value: 5,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
              currentRow: true,
            },
            {
              type: "digit",
              value: 3,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
              currentRow: true,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: true,
              animate: false,
              animation: ``,
              currentRow: true,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
              currentRow: true,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
              currentRow: true,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
              currentRow: true,
            },
            {
              type: "hint",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
              currentRow: true,
            },
          ]}
          currentRow={true}
          row={5}
        />

        <Row
          rectangles={[
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "digit",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
            {
              type: "hint",
              value: ``,
              color: "none",
              active: false,
              animate: false,
              animation: ``,
            },
          ]}
          currentRow={false}
          row={6}
        />
      </div>
    </div>
  );
}
