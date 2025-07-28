"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import DropdownMenu from "@/app/components/dropdownMenu/dropdownMenu";
import { Item } from "@/app/components/dropdownMenu/dropdownMenu";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ProfileLoggedIn from "@/app/components/icons/profile_logged_in";

const linksMenu: Item[] = [
  { type: "link", label: "2 Digits", href: "/digits2" },
  { type: "link", label: "3 Digits", href: "/digits3" },
  { type: "link", label: "4 Digits", href: "/digits4" },
  { type: "link", label: "5 Digits", href: "/digits5" },
  { type: "link", label: "6 Digits", href: "/digits6" },
  { type: "link", label: "7 Digits", href: "/digits7" },
];

const profileMenu: Item[] = [
  { type: "link", label: "Your Profile", href: "/profile" },
  {
    type: "action",
    label: "Logout",
    onClick: () => {
      console.log("We logged out");
    },
  },
];

export default function Page() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.page}>
      <div className={styles.wrapper} ref={containerRef}>
        <DropdownMenu
          menu={linksMenu}
          label="Game Modes"
          containerRef={containerRef}
          title={`Game Modes`}
        />
        <DropdownMenu
          menu={profileMenu}
          label={<ProfileLoggedIn />}
          containerRef={containerRef}
          title={`Your Profile`}
        />
      </div>
    </div>
  );
}
