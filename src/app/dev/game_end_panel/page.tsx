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
            ["green", "grey", "yellow", "grey", "grey", "lower"],
            ["green", "green", "yellow", "grey", "grey", "higher"],
            ["green", "green", "green", "green", "green", "green"],
            ["none", "none", "none", "none", "none", "none"],
            ["none", "none", "none", "none", "none", "none"],
            ["none", "none", "none", "none", "none", "none"],
          ]}
          scores={[2, 3, 3, 4, 4, 4, 4, 5, 5, 7]}
          date={new Date()}
          closeFunction={() => {}}
        />
        <EndPanel
          result="defeat"
          correctNumber="7653120"
          hints={[
            ["grey", "grey", "grey", "grey", "grey", "grey", "grey", "higher"],
            ["green", "grey", "grey", "grey", "grey", "grey", "grey", "lower"],
            ["green", "green", "yellow", "grey", "grey", "grey", "grey", "higher"],
            ["green", "green", "yellow", "grey", "grey", "grey", "grey", "lower"],
            ["green", "green", "yellow", "grey", "grey", "grey", "grey", "higher"],
            ["green", "green", "green", "yellow", "grey", "grey", "grey", "lower"],
          ]}
          scores={[2, 3, 3, 4, 4, 4, 5, 7]}
          date={new Date()}
          closeFunction={() => {}}
        />
      </div>
    </div>
  );
}
