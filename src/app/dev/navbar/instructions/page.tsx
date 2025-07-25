"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Instructions from "@/app/components/navbar/instructions/instructions";

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.items_wrapper}>
          <Instructions
            digits="4"
            style={{
              border: "0.1rem solid light-dark(black, white)",
              width: "36rem",
            }}
          />
          <Instructions
            digits="5"
            style={{
              border: "0.1rem solid light-dark(black, white)",
              width: "36rem",
            }}
          />
        </div>
      </div>
    </div>
  );
}
