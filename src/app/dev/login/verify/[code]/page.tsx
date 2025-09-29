import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import Verify from "@/app/components/loginSystem/verification/verify";
import { Suspense } from "react";
import ArrowLoader from "@/app/components/loaders/arrow_loader";
import Navbar from "@/app/components/navbar/navbar";

export const metadata: Metadata = {
  title: "Verifying...",
  description: `This is a description about the page`,
};

export default async function VerifyPage({
  params,
}: {
  params: { code: string };
}) {
  const { code } = await params;
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.verify_wrapper}>
        <Suspense fallback={<ArrowLoader />}>
          <Verify code={code} />
        </Suspense>
      </div>
    </div>
  );
}
