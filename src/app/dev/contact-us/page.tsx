import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import Navbar from "@/app/components/navbar/navbar";
import Contact from "@/app/components/contact/contact";
import Footer from "@/app/components/Footer/footer";


export const metadata: Metadata = {
  title: "Test Page",
  description: `This is a description about the page`,
};

export default function Page() {
  return (
    <div className={styles.page}>
      <Navbar />
      <Contact />
      <Footer />
    </div>
  );
}
