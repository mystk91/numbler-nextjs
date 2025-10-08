"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Navbar from "@/app/components/navbar/navbar";
import { useRef } from "react";

export default function Page() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className={styles.page} ref={pageRef}>
      <div className={styles.wrapper}>
        <Navbar digits={5} containerRef={pageRef} />
      </div>
    </div>
  );
}
