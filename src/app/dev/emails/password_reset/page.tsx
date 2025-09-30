import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import { password_email } from "@/app/lib/emails/account_emails";

export const metadata: Metadata = {
  title: "Password Email",
};

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div dangerouslySetInnerHTML={{ __html: password_email("jgeijg9j") }} />
      </div>
    </div>
  );
}
