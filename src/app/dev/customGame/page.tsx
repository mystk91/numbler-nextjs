import styles from "./page.module.css";
import type { Metadata } from "next";
import Navbar from "@/app/components/navbar/navbar";
import CustomGame from "@/app/components/game/customGame/customGame";
export const metadata: Metadata = {
  title: "Custom Game",
  description: `A mode for playing custom games`,
};

export default function Page() {
  return <CustomGame />;
}
