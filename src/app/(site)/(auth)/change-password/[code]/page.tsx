import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import Navbar from "@/app/components/navbar/navbar";
import ChangePassword from "@/app/components/loginSystem/passwordChange/passwordChange";

export const metadata: Metadata = {
  title: "Change Password",
  description: `Change your password`,
};

export default async function ChangePasswordPage({
  params,
}: {
  params: { code: string };
}) {
  const { code } = await params;
  return (
    <div className={styles.wrapper}>
      <ChangePassword code={code} />
    </div>
  );
}
