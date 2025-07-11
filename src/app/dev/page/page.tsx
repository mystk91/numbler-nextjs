import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Page",
  description: `This is a description about the page`,
};

export default function Page() {
  return <div className={styles.page}>

  </div>
}
