import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import { verification_email } from "@/app/lib/emails/account_emails";

export const metadata: Metadata = {
  title: "Confirmation Email",
};

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div
          dangerouslySetInnerHTML={{ __html: verification_email("jgeijg9j") }}
        />
      </div>
    </div>
  );
}
