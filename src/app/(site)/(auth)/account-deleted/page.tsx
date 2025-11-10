import styles from "./page.module.css";
import type { Metadata } from "next";
import AccountDeleted from "@/app/components/loginSystem/deleteComplete/deleteComplete";
import Footer from "@/app/components/Footer/footer";

export const metadata: Metadata = {
  title: "Account Deleted",
  description: "Your account has been deleted",
};

export default async function Page() {
  return (
    <div className={styles.wrapper}>
      <AccountDeleted />
    </div>
  );
}
