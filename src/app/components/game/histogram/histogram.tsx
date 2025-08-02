"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./histogram.module.css";
import classNames from "classnames";
import { createHistogram } from "perf_hooks";

interface HistogramProps {
  scores: number[];
  numDigits: number;
}

type HistogramColors = "lightGreen" | "darkGreen" | "yellow" | "red";

export default function Histogram({ scores, numDigits }: HistogramProps) {
  const [histogramData, setHistogramData] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  });
  const histogramColors = useRef<Record<number, HistogramColors>>({
    1: "lightGreen",
    2: "lightGreen",
    3: "darkGreen",
    4: "darkGreen",
    5: "yellow",
    6: "yellow",
    7: "red",
  });
  const averageRef = useRef<number | null>(null);
  const highestFrequency = useRef<number>(0);

  // Creates the histogram on mount
  useEffect(() => {
    createHistogram();
    return () => {};
  }, []);

  function createHistogram() {
    const data = { ...histogramData };
    let total = 0;
    scores.forEach((score) => {
      data[score] += 1;
      total += score;
    });
    averageRef.current = Number((total / scores.length).toFixed(3));
    Object.values(data).forEach((value) => {
      if (highestFrequency.current < value) {
        highestFrequency.current = value;
      }
    });
    setHistogramData(data);
  }

  return (
    averageRef.current && (
      <div className={styles.histogram} aria-label="A histogram of your scores">
        <h2 className={styles.histogram_header}>
          <div>{`Average (${numDigits} digits) :`}</div>
          <div className={styles.average}>{averageRef.current.toFixed(3)}</div>
        </h2>
        <div className={styles.rows}>
          {Object.entries(histogramData).map(([key, value], index) => (
            <div
              key={key}
              className={classNames(styles.row)}
              aria-label={`${value} game${
                value !== 1 ? "s" : ""
              } solved in ${key} guess${Number(key) !== 1 ? "s" : ""}`}
            >
              <div className={styles.score}>{key}</div>
              <div
                className={classNames(
                  styles.bar,
                  styles[histogramColors.current[Number(key)]]
                )}
                style={
                  {
                    width: `${(value / highestFrequency.current) * 100}%`,
                    "--bar-index": index,
                  } as React.CSSProperties
                }
              ></div>
              {value > 0 && <div className={styles.frequency}>{value}</div>}
            </div>
          ))}
        </div>
      </div>
    )
  );
}
