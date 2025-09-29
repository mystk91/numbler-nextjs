import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import ArrowLoader from "@/app/components/loaders/arrow_loader";

export const metadata: Metadata = {
  title: "Arrow Loader",
  description: `This is a description about the page`,
};

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <ArrowLoader />
      </div>
    </div>
  );
}
