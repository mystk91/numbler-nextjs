"use client";
import ExpectedError from "@/app/components/errors/Expected Error/error";
import styles from "./page.module.css";
export default function Page() {
  return (
    <div className={styles.page}>
      <ExpectedError reset={() => window.location.reload()} />
    </div>
  );
}
