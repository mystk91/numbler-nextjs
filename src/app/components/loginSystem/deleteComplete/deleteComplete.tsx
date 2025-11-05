"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./deleteComplete.module.css";
import classNames from "classnames";
import InputWrapper from "@/app/components/inputs/Text Input Wrapper - Trendy/input_wrapper";
import Button from "@/app/components/buttons/Button Set/button";
import ArrowLoader from "@/app/components/loaders/arrow_loader";
import Modal from "@/app/components/Modal Versatile Portal/modal";
import { useRouter } from "next/router";

interface DeleteAccount {
  style?: React.CSSProperties;
}

export default function DeleteAccount({ style }: DeleteAccount) {
  return (
    <div
      className={styles.delete_account_container}
      aria-label="Account Deleted Message"
    >
      <div
        className={styles.message}
      >{`Your account has been deleted. No further action is needed.`}</div>
    </div>
  );
}
