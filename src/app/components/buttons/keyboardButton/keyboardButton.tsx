"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  JSX,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./keyboardButton.module.css";
import classNames from "classnames";

/*
 * backgroundColor - changes the background color + text color, used to give hints in the game
 * onKeydown - does an extra keydown function, we will use this for some arrow controls
 * keyPressToken - we pass in a token from the keyboard to fire the onKeydown multiple times in succession
 */
interface KeyboardButtonProps {
  backgroundColor: `none` | `grey` | `yellow` | `green`;
  text?: string;
  children?: React.ReactNode;
  icon?: JSX.Element;
  variant?: "keyboard";
  onClick?: Function;
  width: "default" | "smallest" | "full";
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
  form?: string;
  name?: string;
  title?: string;
  disabled?: boolean;
  tabIndex?: number;
  id?: string;
  style?: React.CSSProperties;
  onKeyDown?: (e?: React.KeyboardEvent<HTMLButtonElement>) => void;
  keyPressToken?: number | string;
  keyType?: "number" | "enter" | "backspace" | "toggle";
}

function KeyboardButton(
  {
    backgroundColor,
    text,
    children,
    icon,
    variant = "keyboard",
    width = "default",
    onClick,
    ariaLabel,
    type = "button",
    form,
    name,
    title,
    disabled = false,
    tabIndex,
    id,
    style,
    onKeyDown,
    keyPressToken,
    keyType = "number",
  }: KeyboardButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useImperativeHandle(ref, () => buttonRef.current!);

  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  const [active, setActive] = useState(false);
  const enabled = useRef(true);
  const enterKeyDown = useRef(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePointerDown = () => {
    if (enabled.current) {
      clearTimeout(timeoutRef.current);
      enabled.current = false;
      setActive(false);
      timeoutRef.current = setTimeout(() => {
        setActive(true);
      }, 80);
    }
  };

  const handlePointerUp = () => {
    if (!enabled.current) {
      clearTimeout(timeoutRef.current);
      setActive(true);
      enabled.current = true;
      timeoutRef.current = setTimeout(() => {
        setActive(false);
        onClick?.();
      }, 80);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if ((e.key === "Enter" || e.key === " ") && enabled.current) {
      e.preventDefault();
      clearTimeout(timeoutRef.current);
      enabled.current = false;
      enterKeyDown.current = true;
      setActive(true);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === "Enter" || e.key === " ") && !enabled.current) {
      e.preventDefault();
      setActive(false);
      timeoutRef.current = setTimeout(() => {
        enabled.current = true;
        enterKeyDown.current = false;
        onClick?.();
      }, 80);
    }
  };

  const handleMouseLeave = () => {
    if (!enterKeyDown.current) {
      enabled.current = true;
      setActive(false);
    }
  };

  const handleBlur = () => {
    enabled.current = true;
    enterKeyDown.current = false;
    setActive(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (buttonRef.current && e.touches.length > 0) {
      const touch = e.touches[0];
      if (
        !buttonRef.current.contains(
          document.elementFromPoint(touch.clientX, touch.clientY)
        )
      ) {
        setActive(false);
        enabled.current = true;
      }
    }
  };

  useEffect(() => {
    if (keyPressToken) {
      setActive(false);
      setActive(true);
      timeoutRef.current = setTimeout(() => {
        setActive(false);
        onClick?.();
      }, 160);
    }
  }, [keyPressToken]);

  return (
    <button
      ref={buttonRef}
      id={id}
      name={name}
      title={title}
      className={classNames(
        styles.button,
        styles[variant],
        styles[width],
        styles[backgroundColor],
        styles[keyType],
        {
          [styles.active]: active,
        }
      )}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onTouchMove={handleTouchMove}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseLeave={handleMouseLeave}
      onBlur={handleBlur}
      aria-label={ariaLabel}
      type={type}
      form={form}
      disabled={disabled}
      tabIndex={tabIndex}
      style={{ ...style }}
    >
      {icon && <div className={styles.icon_container}>{icon}</div>}
      {(children || text) && (
        <div className={styles.text_wrapper}>{children || text}</div>
      )}
    </button>
  );
}

export default forwardRef<HTMLButtonElement, KeyboardButtonProps>(
  KeyboardButton
);
