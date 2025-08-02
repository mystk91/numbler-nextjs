"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import TextInput from "@/app/components/loginSystem/inputs/Text Input - Trendy/textInput";
import styles from "./input_wrapper.module.css";

interface InputWrapperProps {
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
  error?: string;
}

export default function InputWrapper({
  id,
  name,
  label,
  type,
  value,
  onChange,
  inputRef,
  maxLength,
  ariaDescribedBy,
  togglePassword,
  autocomplete,
  error,
}: InputWrapperProps) {
  return (
    <div className={styles.input_wrapper}>
      <TextInput
        id={id}
        name={name}
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        inputRef={inputRef}
        maxLength={maxLength}
        ariaDescribedBy={ariaDescribedBy}
        togglePassword={togglePassword}
        autocomplete={autocomplete}
      />
      {error && (
        <div className={styles.error} id={ariaDescribedBy} aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
}
