import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Directory",
  description: `This is a description about the page`,
};

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div>
          <h1>{`Buttons`}</h1>
          <Link href="/dev/buttons">{`Button Set`}</Link>
        </div>
        <div>
          <h1>{`Navbar`}</h1>
          <Link href="/dev/navbar">{`Navbar`}</Link>
          <Link href="/dev/navbar/instructions">{`Instructions`}</Link>
          <Link href="/dev/login">{`Login`}</Link>
          <Link href="/dev/dropdown">{`Dropdown Menu`}</Link>
          <Link href="/dev/navbar/buttons">{`Navbar Buttons`}</Link>
        </div>
        <div>
          <h1>{`Keyboard`}</h1>
          <Link href="/dev/keyboard">{`Keyboard`}</Link>
          <Link href="/dev/keyboard/buttons">{`Keyboard Buttons`}</Link>
        </div>

        <div>
          <h1>{`Game`}</h1>
          <Link href="/dev/rectangle">{`Rectangle`}</Link>
          <Link href="/dev/row">{`Row`}</Link>
          <Link href="/dev/gameboard">{`Gameboard`}</Link>
          <Link href="/dev/game">{`Game`}</Link>
          <Link href="/dev/game_end_panel">{`Game End Panel`}</Link>
          <Link href="/dev/scramble">{`Scramble / Descramble`}</Link>
        </div>
        <div>
          <h1>{`Login`}</h1>
          <Link href="/dev/login">{`Login`}</Link>
          <Link href="/dev/login/signup">{`Signup`}</Link>
          <Link href="/dev/login/password-reset">{`Password Reset`}</Link>
        </div>
      </div>
    </div>
  );
}
