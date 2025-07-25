"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Button from "@/app/components/buttons/Button Set/button";

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <Button variant="primary">{`Accept`}</Button>
        <Button variant="red">{`Cancel`}</Button>
        <Button variant="green">{`Cancel`}</Button>
        <Button variant="secondary">{`Cancel`}</Button>
        <Button variant="tertiary">{`Info`}</Button>
      </div>
    </div>
  );
}
