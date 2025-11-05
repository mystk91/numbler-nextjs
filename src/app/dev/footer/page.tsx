"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import Navbar from "@/app/components/navbar/navbar";
import Footer from "@/app/components/Footer/footer";

export default function Page() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.page_content}></div>
      <Footer />
    </div>
  );
}
