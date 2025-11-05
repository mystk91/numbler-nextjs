"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./verificationMessage.module.css";
import Button from "@/app/components/buttons/Button Set/button";

interface VerifyProps {
  success: boolean;
}

export default function VertificationMessage({ success }: VerifyProps) {
  return success ? (
    <div className={styles.verify}>
      <div className={styles.message}>{`Your account has been created!`}</div>
      <Link
        href={"/login"}
        style={{
          borderRadius: "1.6rem",
          width: "80%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button variant="primary" tabIndex={-1} style={{ width: "100%" }}>
          {`Go to Login`}
        </Button>
      </Link>
    </div>
  ) : (
    <div className={styles.verify}>
      <div className={styles.message}>
        {`This verification code has expired or does not exist.`}
      </div>
    </div>
  );
}
