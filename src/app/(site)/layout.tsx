"use client";
import Navbar from "@/app/components/navbar/navbar";
import styles from "./page.module.css";
import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const containerRef = useRef<null | HTMLDivElement>(null);
  const [digits, setDigits] = useState<
    `2` | `3` | `4` | ` 5` | `6` | `7` | undefined
  >(undefined);

  // Used to update the navbar when user changes pages
  function updateNavbar() {
    const arr = path.split(`/`);
    const page = arr[arr.length - 1];
    if (arr.length === 1 && page.substring(0, page.length - 2) === `digits`) {
      const digit = page[page.length - 1];
      if (["2", "3", "4", " 5", "6", "7"].includes(digit)) {
        setDigits(digit);
      } else {
        setDigits(undefined);
      }
    } else {
      setDigits(undefined);
    }
  }

  useEffect(() => {
    updateNavbar();
  }, [path]);

  return (
    <div className={styles.page} ref={containerRef}>
      <Navbar digits={digits} containerRef={containerRef} />
      {children}
      <div id="modal"></div>
    </div>
  );
}
