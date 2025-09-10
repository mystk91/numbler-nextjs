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
import Link from "next/link";
import styles from "./button.module.css";
import classNames from "classnames";

interface ButtonProps {
  text?: string;
  children?: React.ReactNode;
  icon?: JSX.Element;
  variant: "primary" | "secondary" | "tertiary" | "red" | "green";
  onClick?: () => void;
  onKeyDown?: (e?: React.KeyboardEvent<HTMLButtonElement>) => void;
  width?: "default" | "smallest" | "full";
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
  form?: string;
  name?: string;
  title?: string;
  disabled?: boolean;
  draggable?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;
  id?: string;
  style?: React.CSSProperties;
}

export function Button(
  {
    text,
    children,
    icon,
    variant,
    width = "default",
    onClick,
    onKeyDown,
    ariaLabel,
    type = "button",
    form,
    name,
    title,
    disabled = false,
    draggable,
    autoFocus = false,
    tabIndex,
    id,
    style,
  }: ButtonProps,
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
      }, 40);
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
      }, 40);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
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
      }, 40);
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

  return (
    <button
      ref={buttonRef}
      id={id}
      name={name}
      title={title}
      className={classNames(styles.button, styles[variant], styles[width], {
        [styles.active]: active,
      })}
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
      draggable={draggable}
      autoFocus={autoFocus}
      tabIndex={tabIndex}
      style={{ ...style }}
    >
      {icon && <div className={styles.icon_container}>{icon}</div>}
      {children || text}
    </button>
  );
}

export default forwardRef<HTMLButtonElement, ButtonProps>(Button);
