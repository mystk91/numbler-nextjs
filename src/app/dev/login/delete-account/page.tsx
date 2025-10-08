"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import DeleteAccount from "@/app/components/loginSystem/deleteAccount/deleteAccount";
import { useState, useEffect } from "react";

export default function Page() {
  const [showPanel, setShowPanel] = useState(false);

  // Show the modal after component mounts
  useEffect(() => {
    setShowPanel(true);
  }, []);

  return (
    <div className={styles.page}>
      {showPanel && (
        <div className={styles.wrapper}>
          <DeleteAccount
            closeFunction={() => {
              setShowPanel(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
