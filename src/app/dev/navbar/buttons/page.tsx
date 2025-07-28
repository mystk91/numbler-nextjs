"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import navbarButton from "@/app/components/buttons/navbarButton/navbarButton";
import QuestionMark from "@/app/components/icons/questionMark";
import Profile from "@/app/components/icons/profile";
import NavbarButton from "@/app/components/buttons/navbarButton/navbarButton";

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <NavbarButton
          title={"Game Instructions"}
          aria-label="Click to open the game instructions"
          onClick={() => `You opened the instructions`}
          style={{ padding: "0.6rem" }}
        >
          <QuestionMark />
        </NavbarButton>
        <NavbarButton
          title="Login"
          aria-label="Click to open the login panel"
          onClick={() => `You opened the login panel`}
        >
          <Profile />
        </NavbarButton>
      </div>
    </div>
  );
}
