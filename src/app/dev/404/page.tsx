"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import Navbar from "@/app/components/navbar/navbar";
import Footer from "@/app/components/Footer/footer";
import NotFound from "@/app/components/errors/Not Found/notFound";

export default function Page() {
  return (
    <div className={styles.page}>
      <Navbar />
      <NotFound />
      <Footer />
    </div>
  );
}
