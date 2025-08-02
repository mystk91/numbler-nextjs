"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./textInput.module.css";

interface TextInputProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "password";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  maxLength?: number;
  ariaDescribedBy?: string;
  togglePassword?: boolean;
  autocomplete?: string;
  style?: React.CSSProperties;
}

//Eye icons for toggling password visibility
const eyeSVG = (
  <svg
    className={styles.eye}
    aria-label="Eye Icon"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 122.88 65.06"
  >
    <path d="M.95 30.01c2.92-3.53 5.98-6.74 9.15-9.63C24.44 7.33 41.46.36 59.01.01c17.51-.35 35.47 5.9 51.7 19.29 3.88 3.2 7.63 6.77 11.24 10.74a3.564 3.564 0 0 1 .23 4.51c-4.13 5.83-8.88 10.82-14.07 14.96-12.99 10.37-28.77 15.47-44.76 15.55-15.93.07-32.06-4.86-45.8-14.57A82.228 82.228 0 0 1 .77 34.64c-1.11-1.4-1-3.37.18-4.63zm60.49-3.55c.59 0 1.17.09 1.71.24-.46.5-.73 1.17-.73 1.9 0 1.56 1.26 2.82 2.82 2.82.77 0 1.46-.3 1.97-.8.2.6.3 1.24.3 1.9 0 3.35-2.72 6.07-6.07 6.07s-6.07-2.72-6.07-6.07c0-3.34 2.72-6.06 6.07-6.06zm0-15.64c5.99 0 11.42 2.43 15.35 6.36 3.93 3.93 6.36 9.35 6.36 15.35 0 5.99-2.43 11.42-6.36 15.35a21.628 21.628 0 0 1-15.35 6.36c-5.99 0-11.42-2.43-15.35-6.36a21.628 21.628 0 0 1-6.36-15.35c0-5.99 2.43-11.42 6.36-15.35 3.93-3.93 9.36-6.36 15.35-6.36zm10.45 11.26a14.746 14.746 0 0 0-10.45-4.33c-4.08 0-7.78 1.65-10.45 4.33a14.746 14.746 0 0 0-4.33 10.45c0 4.08 1.65 7.78 4.33 10.45 2.67 2.67 6.37 4.33 10.45 4.33 4.08 0 7.78-1.65 10.45-4.33 2.67-2.67 4.33-6.37 4.33-10.45 0-4.08-1.66-7.78-4.33-10.45zm-57 3.55a86.454 86.454 0 0 0-6.7 6.82c4.07 4.72 8.6 8.8 13.45 12.23 12.54 8.85 27.21 13.35 41.69 13.29 14.42-.07 28.65-4.67 40.37-14.02 4-3.19 7.7-6.94 11.03-11.25-2.79-2.91-5.63-5.54-8.51-7.92C91.33 12.51 75 6.79 59.15 7.1c-15.81.32-31.22 6.66-44.26 18.53z" />
  </svg>
);
const closedEyeSVG = (
  <svg
    className={styles.closed_eye}
    aria-label="Closed Eye Icon"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 122.879 79.699"
  >
    <path d="M.955 37.326a94.6 94.6 0 0 1 9.151-9.625C24.441 14.654 41.462 7.684 59.01 7.334c6.561-.131 13.185.665 19.757 2.416l-5.904 5.904a63.394 63.394 0 0 0-13.714-1.233c-15.811.316-31.215 6.657-44.262 18.533a86.636 86.636 0 0 0-6.702 6.82 74.514 74.514 0 0 0 13.452 12.227 73.307 73.307 0 0 0 9.296 5.586l-5.262 5.262a80.076 80.076 0 0 1-8.12-5.039A81.993 81.993 0 0 1 .771 41.96a3.554 3.554 0 0 1 .184-4.634zM96.03 0l5.893 5.893-73.804 73.806-5.894-5.895L96.03 0zm1.69 17.609c4.423 2.527 8.767 5.528 12.994 9.014a108.665 108.665 0 0 1 11.24 10.735 3.55 3.55 0 0 1 .226 4.507c-4.131 5.834-8.876 10.816-14.069 14.963-12.992 10.371-28.773 15.477-44.759 15.549-6.114.027-9.798-3.141-15.825-4.576l3.545-3.543a69.917 69.917 0 0 0 12.252 1.031c14.421-.064 28.653-4.668 40.366-14.02a65.41 65.41 0 0 0 11.028-11.254 99.663 99.663 0 0 0-8.508-7.918c-4.455-3.673-9.042-6.759-13.707-9.273l5.217-5.215zm-36.28.534c2.664 0 5.216.481 7.576 1.359l-5.689 5.689a14.887 14.887 0 0 0-1.886-.119A14.73 14.73 0 0 0 50.992 29.4a14.733 14.733 0 0 0-4.328 10.45c0 .639.04 1.268.119 1.885l-5.689 5.691a21.655 21.655 0 0 1-1.359-7.576 21.64 21.64 0 0 1 6.358-15.349 21.629 21.629 0 0 1 15.347-6.358zm20.673 15.073a21.7 21.7 0 0 1 1.032 6.634 21.64 21.64 0 0 1-6.357 15.348 21.64 21.64 0 0 1-15.348 6.357c-2.313 0-4.542-.361-6.633-1.033l5.914-5.914A14.729 14.729 0 0 0 71.889 50.3a14.732 14.732 0 0 0 4.31-11.169l5.914-5.915z" />
  </svg>
);

export default function TextInput({
  id,
  name,
  label,
  value,
  type = "text",
  onChange,
  inputRef,
  maxLength,
  ariaDescribedBy,
  togglePassword = false,
  autocomplete,
  style,
}: TextInputProps) {
  const ref = inputRef ?? useRef<HTMLInputElement>(null);
  const [labelMoved, setLabelMoved] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  //Moves the label above the input area
  function moveLabelUp() {
    setLabelMoved(true);
  }

  //Moves the label down into the input area
  function moveLabelDown() {
    if ("current" in ref && ref.current?.value.length === 0) {
      setLabelMoved(false);
    }
  }

  return (
    <div className={styles.input_wrapper} style={style}>
      <label
        htmlFor={id}
        className={labelMoved ? styles.moved : styles.initial}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={togglePassword ? (passwordVisible ? "text" : "password") : type}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        ref={ref}
        onFocus={moveLabelUp}
        onBlur={moveLabelDown}
        aria-describedby={ariaDescribedBy}
        autoComplete={autocomplete}
      />
      {togglePassword && (
        <button
          type="button"
          className={styles.password_toggle}
          onClick={() => setPasswordVisible(!passwordVisible)}
          tabIndex={50}
          aria-label={passwordVisible ? "Hide password" : "Show password"}
          aria-pressed={passwordVisible}
        >
          {passwordVisible ? eyeSVG : closedEyeSVG}
        </button>
      )}
    </div>
  );
}
