"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import Navbar from "@/app/components/navbar/navbar";
import Game from "@/app/components/game/game/game";
import { useRef } from "react";

export default function Page() {
  const containerRef = useRef<null | HTMLDivElement>(null);

  return (
    <div className={styles.page} ref={containerRef}>
      <Navbar digits={5} containerRef={containerRef} />
      <Game digits={5} />
    </div>
  );
}
