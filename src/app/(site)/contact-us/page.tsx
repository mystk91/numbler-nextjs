import styles from "./page.module.css";
import type { Metadata } from "next";
import Contact from "@/app/components/contact/contact";
import Footer from "@/app/components/Footer/footer";

export const metadata: Metadata = {
  title: "Numbler - Contact Us",
  description: "Contact information for Numbler",
};

export default function Page() {
  return (
    <>
      <Contact />
      <Footer />
    </>
  );
}
