import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import VerificationMessage from "@/app/components/loginSystem/verification/verificationMessage";

export const metadata: Metadata = {
  title: "Verifications",
};

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <VerificationMessage success={true} />
        <VerificationMessage success={false} />
      </div>
    </div>
  );
}
