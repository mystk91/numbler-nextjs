import styles from "./page.module.css";
import type { Metadata } from "next";
import PasswordReset from "@/app/components/loginSystem/passwordReset/passwordReset";

export const metadata: Metadata = {
  title: "Password Reset",
  description: "Reset your password",
};

export default async function PasswordResetPage() {
  return (
    <div className={styles.wrapper}>
      <PasswordReset />
    </div>
  );
}
