import styles from "./page.module.css";
import type { Metadata } from "next";
import Navbar from "@/app/components/navbar/navbar";
import Homepage from "@/app/components/homepage/homepage";
import Footer from "@/app/components/Footer/footer";

export const metadata: Metadata = {
  title: "Numbler",
  description: `A number guessing game. Use hints to zero in on the correct number!`,
};

export default function Page() {
  return (
    <div className={styles.page}>
      <Navbar />
      <Homepage />
      <Footer />
    </div>
  );
}
