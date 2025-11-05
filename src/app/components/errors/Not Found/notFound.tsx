"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./notFound.module.css";
import Button from "@/app/components/buttons/Button Set/button";

// The 404 component
export default function NotFound({
  errorMessage = `There isn't anything on this page`,
  buttonText = `Return Home`,
  href = `/`,
}: {
  errorMessage?: string;
  buttonText?: string;
  href?: string;
}) {
  return (
    <div className={styles.error_wrapper}>
      <div className={styles.error} role="alert" aria-live="assertive">
        <div className={styles.error_message}>{errorMessage}</div>
        <Link
          href={href}
          style={{
            borderRadius: "1.6rem",
            width: "80%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button variant={"primary"} tabIndex={-1} width="full">
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  );
}
