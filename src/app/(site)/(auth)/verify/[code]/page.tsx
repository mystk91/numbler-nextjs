import styles from "./page.module.css";
import type { Metadata } from "next";
import Verify from "@/app/components/loginSystem/verification/verify";
import { Suspense } from "react";
import ArrowLoader from "@/app/components/loaders/arrow_loader";

export const metadata: Metadata = {
  title: "Numbler - Verification",
  description: `This is a description about the page`,
};

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return (
    <div className={styles.wrapper}>
      <Suspense fallback={<ArrowLoader />}>
        <Verify code={code} />
      </Suspense>
    </div>
  );
}
