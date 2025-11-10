import styles from "./page.module.css";
import type { Metadata } from "next";
import Signup from "@/app/components/loginSystem/signup/signup";

export const metadata: Metadata = {
  title: "Numbler - Signup",
  description: "Create a Numbler account",
};

export default async function Page() {
  return (
    <div className={styles.wrapper}>
      <Signup />
    </div>
  );
}
