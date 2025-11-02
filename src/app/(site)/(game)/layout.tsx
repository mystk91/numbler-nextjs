"use client";
import Navbar from "@/app/components/navbar/navbar";
import styles from "./page.module.css";
import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cssTransition, ToastContainer } from "react-toastify";

export default function Layout({
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

  useEffect(() => {
    updateVisitorCount();
  }, []);

  async function updateVisitorCount() {
    const visited = localStorage.getItem("visited");
    const date = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      })
    );
    const dateString = `${date.getMonth() + 1}-${date.getDate()}`;
    if (visited === dateString) return;
    // We are going to set the localStorage key inside the navbar
    // This lets us show them the instructions the first time they visit
    const options = {
      method: "POST",
      body: JSON.stringify({
        newVisitor: !visited,
      }),
      headers: { "Content-Type": "application/json" },
    };
    // We don't need to wait for the response
    fetch("/api/analytics/updateVisitorCount", options);
  }

  return (
    <>
      {children}
      <div
        style={{
          height: "7.2rem",
          flexShrink: 0,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          backgroundColor: "grey",
          color: "white",
          fontSize: "1.8rem",
        }}
      >{`Ad space`}</div>
      <ToastContainer
        limit={1}
        transition={transition}
        position={"top-center"}
      />
    </>
  );
}
