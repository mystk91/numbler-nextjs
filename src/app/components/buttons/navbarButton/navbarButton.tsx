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
import styles from "./navbarButton.module.css";
import classNames from "classnames";

interface ButtonProps {
  text?: string;
  children?: React.ReactNode;
  icon?: JSX.Element;
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
    onClick,
    ariaLabel,
    type = "button",
    form,
    name,
    title,
    disabled = false,
    draggable = false,
    autoFocus = false,
    tabIndex,
    id,
    style,
  }: ButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useImperativeHandle(ref, () => buttonRef.current!);

  function handleKeydown(e: React.KeyboardEvent) {
    e.stopPropagation();
    if (e.key === "Enter") {
      onClick?.();
    }
  }

  return (
    <button
      ref={buttonRef}
      id={id}
      name={name}
      title={title}
      onClick={onClick}
      className={classNames(styles.navbar_button)}
      onKeyDown={handleKeydown}
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
