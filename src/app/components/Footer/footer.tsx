"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./footer.module.css";
import classNames from "classnames";

interface FooterProps {
  style?: React.CSSProperties;
}

export default function Footer({ style }: FooterProps) {
  return (
    <div style={{ ...style }} className={styles.footer}>
      <Link href="/policy/tos">{`Terms of Service`}</Link>
      <Link href="/policy/privacy">{`Privacy Policy`}</Link>
      <Link href="/contact-us">{`Contact Us`}</Link>
    </div>
  );
}
