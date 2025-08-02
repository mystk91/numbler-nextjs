"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import EndPanel from "@/app/components/game/endPanel/endPanel";

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <EndPanel
          result="victory"
          correctNumber="12345"
          hints={[
            ["G", "X", "Y", "X", "X", "L"],
            ["G", "G", "Y", "X", "X", "H"],
            ["G", "G", "G", "G", "G", "E"],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
          ]}
          scores={[2, 3, 3, 4, 4, 4, 4, 5, 5, 7]}
          date={new Date()}
          closeFunction={() => {}}
        />
        <EndPanel
          result="defeat"
          correctNumber="7653120"
          hints={[
            ["X", "X", "X", "X", "X", "X", "X", "H"],
            ["G", "X", "X", "X", "X", "X", "X", "L"],
            ["G", "G", "Y", "X", "X", "X", "X", "H"],
            ["G", "G", "Y", "X", "X", "X", "X", "L"],
            ["G", "G", "Y", "X", "X", "X", "X", "H"],
            ["G", "G", "G", "Y", "X", "X", "X", "L"],
          ]}
          scores={[2, 3, 3, 4, 4, 4, 5, 7]}
          date={new Date()}
          closeFunction={() => {}}
        />
      </div>
    </div>
  );
}
