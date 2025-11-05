"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./arrow_loader.module.css";
import DownArrow from "@/app/components/icons/downArrow";

export default function ArrowLoader() {
  return (
    <div className={styles.arrow_loader}>
      <div className={styles.left_arrow}>
        <DownArrow />
      </div>
      <div className={styles.middle_wrapper}>
        <div className={styles.middle}>
          <div className={styles.equals}></div>
          <div className={styles.equals}></div>
        </div>
      </div>
      <div className={styles.right_arrow}>
        <DownArrow />
      </div>
    </div>
  );
}
