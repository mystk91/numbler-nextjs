import styles from "./page.module.css";
import type { Metadata } from "next";
import ChangePassword from "@/app/components/loginSystem/passwordChange/passwordChange";

export const metadata: Metadata = {
  title: "Change Password",
  description: `Change your password`,
};

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return (
    <div className={styles.wrapper}>
      <ChangePassword code={code} />
    </div>
  );
}
