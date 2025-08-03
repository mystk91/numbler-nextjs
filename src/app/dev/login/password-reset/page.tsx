"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import PasswordReset from "@/app/components/loginSystem/passwordReset/passwordReset";

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <PasswordReset />
      </div>
    </div>
  );
}
