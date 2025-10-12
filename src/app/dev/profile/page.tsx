import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import TabContainer from "@/app/components/Tabs Container/tabsContainer";
import { TabItem } from "@/app/components/Tabs Container/tabsContainer";
import Navbar from "@/app/components/navbar/navbar";

export default function Page() {
  const tabs: TabItem[] = [
    {
      label: "Game Statistics",
      content: <div>{`Your stats tab`}</div>,
      style: { flex: "3" },
    },
    {
      label: "Account & Info",
      content: <div>{`Account management and site info`}</div>,
      style: { flex: "2" },
    },
  ];
  return (
    <div className={styles.page}>
      <Navbar />
      <TabContainer tabs={tabs} />
    </div>
  );
}
