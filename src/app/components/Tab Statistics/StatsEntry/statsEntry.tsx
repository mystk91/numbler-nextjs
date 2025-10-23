"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./statsEntry.module.css";
import classNames from "classnames";
import Rectangle from "@/app/components/game/rectangle/rectangle";
import { Value } from "@/app/components/game/rectangle/rectangle";

export interface StatsEntryProps {
  scores: number[];
  globalAverage?: number;
  digits: number;
}

type HistogramColors = "lightGreen" | "darkGreen" | "yellow" | "red";

export default function StatsEntry({
  scores,
  globalAverage,
  digits,
}: StatsEntryProps) {
  const [initialized, setInitialized] = useState(false);
  const histogramData = useRef<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  });
  const monthHistogramData = useRef<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  });
  const bestMonthHistogramData = useRef<Record<number, number>>({
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
  const averageRef = useRef(``);
  const monthAverageRef = useRef(``);
  const bestMonthAverageRef = useRef(``);
  const highestFrequency = useRef(0);
  const monthHighestFrequency = useRef(0);
  const bestMonthHighestFrequency = useRef(0);

  // Creates the histograms on mount
  useEffect(() => {
    createHistograms();
    setInitialized(true);
    return () => {};
  }, []);
  function createHistograms() {
    //Stats for all games
    [histogramData.current, highestFrequency.current, averageRef.current] =
      createHistogramData(scores);
    // Stats for past 30 games
    const pastMonthScores = scores.slice(
      Math.max(scores.length - 30, 0),
      scores.length
    );
    [
      monthHistogramData.current,
      monthHighestFrequency.current,
      monthAverageRef.current,
    ] = createHistogramData(pastMonthScores);
    // Stats for best 30 consecutive games
    [
      bestMonthHistogramData.current,
      bestMonthHighestFrequency.current,
      bestMonthAverageRef.current,
    ] = createHistogramData(getBest30());
  }

  // Returns histogram data from an inputed scores array
  // Returns the frequencies for each row, the highest frequency, and the average
  function createHistogramData(
    scores: number[]
  ): [Record<number, number>, number, string] {
    const values = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
    } as Record<number, number>;
    let total = 0;
    scores.forEach((score) => {
      values[score] += 1;
      total += score;
    });
    const average = String((total / scores.length).toFixed(3));
    let highestFrequency = 0;
    Object.values(values).forEach((value) => {
      if (highestFrequency < value) {
        highestFrequency = value;
      }
    });
    return [values, highestFrequency, average];
  }

  // Returns the scores from the users best 30 consecutive games
  function getBest30(): number[] {
    const first30 = scores.slice(0, Math.min(30, scores.length));
    let lowestTotal = 0;
    let currentTotal = 0;
    first30.forEach((score) => {
      lowestTotal += score;
    });
    currentTotal = lowestTotal;
    let lastIndex = first30.length;
    for (let i = first30.length; i < scores.length; i++) {
      currentTotal += scores[i] - scores[i - 30];
      if (currentTotal < lowestTotal) {
        lowestTotal = currentTotal;
        lastIndex = i;
      }
    }
    return scores.slice(Math.max(0, lastIndex - 29), lastIndex + 1);
  }

  return (
    initialized && (
      <div
        className={styles.stat_entry}
        aria-label={`Stats for ${digits} digits.`}
      >
        <div className={styles.entry_header}>
          <Rectangle
            type="digit"
            value={digits as Value}
            ariaLabel={`Stats for ${digits} digits`}
            color="none"
            style={{
              borderColor: "var(--grey-text)",
              color: "var(--grey-text)",
              backgroundColor: "var(--lower-color)",
              transform: "translateY(-1.2rem)",
            }}
          />
          <div className={styles.header_stats}>
            <div className={styles.header_stat}>
              <div className={styles.header_stat_label}>{`Your Average`}</div>
              <div className={styles.header_stat_value}>
                {averageRef.current}
              </div>
            </div>
            <div className={styles.header_stat}>
              <div className={styles.header_stat_label}>{`Global Average`}</div>
              <div className={styles.header_stat_value}>
                {globalAverage ? globalAverage : `N/A`}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.histograms_wrapper}>
          <div
            className={styles.histogram}
            aria-label={`A histogram of your past 30 scores for ${digits} digits`}
          >
            <h2 className={styles.histogram_header}>
              <div>{`Past 30: `}</div>
              <div className={styles.average}>{monthAverageRef.current}</div>
            </h2>
            <div className={styles.rows}>
              {Object.entries(monthHistogramData.current).map(
                ([key, value], index) => (
                  <div
                    key={`past-30-${key}`}
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
                          width: `calc((100% - 4rem) * ${
                            value / monthHighestFrequency.current
                          })`,
                          "--bar-index": index,
                        } as React.CSSProperties
                      }
                    ></div>
                    {value > 0 && (
                      <div className={styles.frequency}>{value}</div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className={styles.divider}></div>

          <div
            className={styles.histogram}
            aria-label={`A histogram of your best consecutive 30 scores for ${digits} digits`}
          >
            <h2 className={styles.histogram_header}>
              <div>{`Best 30: `}</div>
              <div className={styles.average}>
                {bestMonthAverageRef.current}
              </div>
            </h2>
            <div className={styles.rows}>
              {Object.entries(bestMonthHistogramData.current).map(
                ([key, value], index) => (
                  <div
                    key={`past-30-${key}`}
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
                          width: `calc((100% - 4rem) * ${
                            value / bestMonthHighestFrequency.current
                          })`,
                          "--bar-index": index,
                        } as React.CSSProperties
                      }
                    ></div>
                    {value > 0 && (
                      <div className={styles.frequency}>{value}</div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className={styles.divider}></div>

          <div
            className={styles.histogram}
            aria-label={`A histogram of all your scores for ${digits} digits`}
          >
            <h2 className={styles.histogram_header}>
              <div>{`All games: `}</div>
              <div className={styles.average}>{averageRef.current}</div>
            </h2>
            <div className={styles.rows}>
              {Object.entries(histogramData.current).map(
                ([key, value], index) => (
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
                          width: `calc((100% - 4rem) * ${
                            value / highestFrequency.current
                          })`,
                          "--bar-index": index,
                        } as React.CSSProperties
                      }
                    ></div>
                    {value > 0 && (
                      <div className={styles.frequency}>{value}</div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
