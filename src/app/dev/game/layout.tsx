"use client";
import "@/app/globals.css";
import { ToastContainer, cssTransition } from "react-toastify";
import Navbar from "@/app/components/navbar/navbar";
import { useRef } from "react";
import styles from "./page.module.css";

export default function ToastLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const enter = "error_toast_enter";
  const exit = "error_toast_exit";
  const transition = cssTransition({
    enter: enter,
    exit: exit,
  });
  const containerRef = useRef<null | HTMLDivElement>(null);

  
  return (
    <div className={styles.page} ref={containerRef}>
      <Navbar digits={4} containerRef={containerRef} />
      {children}
      <ToastContainer
        limit={1}
        transition={transition}
        position={"top-center"}
      />
    </div>
  );
}
