"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./row.module.css";
import classNames from "classnames";
import Rectangle, {
  RectangleProps,
} from "@/app/components/game/rectangle/rectangle";

export interface RowProps {
  rectangles: RectangleProps[];
  row?: number;
  currentRow?: boolean;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

export default function Row({
  rectangles,
  row,
  currentRow,
  ariaLabel,
  style,
}: RowProps) {
  const hint = rectangles[rectangles.length - 1];
  return (
    <div
      className={styles.row}
      aria-label={
        ariaLabel
          ? ariaLabel
          : currentRow
          ? `Row ${row}, current row`
          : `Row ${row}`
      }
      style={{ ...style }}
    >
      <div className={styles.digits_wrapper}>
        {rectangles.slice(0, -1).map((rectangle, index) => (
          <Rectangle
            type={rectangle.type}
            value={rectangle.value}
            color={rectangle.color}
            row={row}
            column={index + 1}
            active={rectangle.active}
            currentRow={rectangle.currentRow}
            animate={rectangle.animate}
            animation={rectangle.animation}
            ariaLabel={rectangle.ariaLabel}
            style={{ ...rectangle.style }}
            key={`${rectangle.type} row-${row} col-${index + 1}`}
          />
        ))}
        <Rectangle
          type={hint.type}
          value={hint.value}
          color={hint.color}
          row={row}
          column={rectangles.length}
          active={hint.active}
          currentRow={hint.currentRow}
          animate={hint.animate}
          animation={hint.animation}
          ariaLabel={hint.ariaLabel}
          style={{ ...hint.style }}
          key={`${hint.type} row-${row} col-${rectangles.length + 1}`}
        />
      </div>
    </div>
  );
}
