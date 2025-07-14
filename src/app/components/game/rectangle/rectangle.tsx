"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./rectangle.module.css";
import classNames from "classnames";
import DownArrow from "@/app/svg/svg_downArrow";
import Equals from "@/app/svg/svg_equals";

/*  Rectangle: used to create the graphic for the game that will hold numbers, arrows, and colored hints
 *
 *  type - the rectangle will contain either a number or a directional arrow
 *  value - the number or arrow that appears inside the rectangle
 *  color - the color of the rectangle
 *  active? - default false, when true it indicates that this is the current rectangle with a thick inner border
 *  currentRow? - default false, when true it indicates the rectangle is on the currently used row in the game
 *  animate? - default true, the rectangle will play its entry animation, we want this to be false when loading multiple old rectangles
 *  animation? - the animation the rectangle will recieve, occurs when its status changes
 *  animationDelay? - in seconds, delays the animation when a prop changes, used because we will have a row of rectangles that are timed differently
 *  ariaLabel? - an optional ariaLabel that will be used rather than our default aria-label
 *  style? - any additional styling
 */
interface RectangleProps {
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
  row?: number;
  column?: number;
  active?: boolean;
  currentRow?: boolean;
  previousRow?: boolean;
  animate?: boolean;
  animation?: `` | `bounce_up` | `bounce_down` | `equals`;
  animationDelay?: number;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

export default function Rectangle({
  type,
  value,
  color,
  row = 0,
  column = 0,
  active = false,
  currentRow = false,
  animate = true,
  animation = ``,
  animationDelay = 0,
  style,
}: RectangleProps) {
  //Generates the aria label based on our props
  function getAriaLabel(): string {
    const colorMessages = {
      none: ``,
      grey: `Number is not used again`,
      yellow: `Number appears in a different column`,
      green: `Number is in the correct column`,
      higher: `Arrow pointing up: Guess higher`,
      lower: `Arrow pointing down: Guess lower`,
    };
    const coordinate = `row ${row}, column ${column}`;
    if (!value)
      return `${active && `Current digit, `}${
        currentRow && `Current row, `
      }Empty ${type} container, ${coordinate}`;
    if (type === "digit") {
      return `${value},${
        currentRow ? ` current row,` : `${color}: ${colorMessages[color]},`
      } ${coordinate}`;
    } else {
      return `hint, ${
        color === "green"
          ? `Equals sign: you guessed correctly!`
          : `${colorMessages[color]},`
      } ${coordinate}`;
    }
  }

  return (
    <div
      className={classNames(
        styles[type],
        styles[color],
        { [styles.active]: active },
        { [styles.current_row]: currentRow },
        { [styles.no_animation]: !animate },
        { [styles[animation]]: animation }
      )}
      style={{
        animationDelay: animationDelay ? `${animationDelay}s` : ``,
        ...style,
      }}
      aria-label={getAriaLabel()}
    >
      {type === "hint" && value ? (
        value === `equals` ? (
          <Equals
            className={classNames(styles.equals, {
              [styles.no_animation]: !animate,
            })}
          />
        ) : (
          <DownArrow
            className={classNames(styles.arrow, styles[value], {
              [styles.no_animation]: !animate,
            })}
          />
        )
      ) : (
        <div
          className={classNames(
            styles.digit_wrapper,
            {
              [styles.no_animation]: !animate,
            },
            { [styles.equals]: animation === "equals" }
          )}
          style={{ animationDelay: animationDelay ? `${animationDelay}s` : `` }}
        >
          {value}
        </div>
      )}
    </div>
  );
}
