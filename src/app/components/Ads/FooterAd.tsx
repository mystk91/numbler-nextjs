"use client";
import styles from "./FooterAd.module.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import classNames from "classnames";

interface AdProps {
  style?: React.CSSProperties;
}

export default function FooterAd({ style }: AdProps) {
  return <div style={{ ...style }} className={styles.ad}>{`Ad Space`}</div>;
}
