import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Numbler",
  description: `A number guessing game. Use hints to zero in on the correct number!`,
};

export default function Page() {
  return <div className={styles.page}></div>;
}
