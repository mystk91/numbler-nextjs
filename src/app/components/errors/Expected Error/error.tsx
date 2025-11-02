"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./error.module.css";
import Button from "@/app/components/buttons/Button Set/button";

// An error meant to show up after failed data fetches
export default function ExpectedError({
  reset,
  errorMessage = `Something went wrong while loading`,
  buttonText = `Refresh`,
}: {
  reset: (e?: React.MouseEvent) => void;
  errorMessage?: string;
  buttonText?: string;
}) {
  return (
    <div className={styles.error_wrapper}>
      <div className={styles.error} role="alert" aria-live="assertive">
        <div className={styles.error_message}>{errorMessage}</div>
        <Button variant={"primary"} onClick={reset}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
