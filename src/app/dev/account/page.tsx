import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import TabContainer from "@/app/components/Tabs Container/tabsContainer";
import { TabItem } from "@/app/components/Tabs Container/tabsContainer";
import Navbar from "@/app/components/navbar/navbar";
import StatsManager from "@/app/components/Tab Statistics/StatsManager/statsManager";
import AccountTab from "@/app/components/Tab Account/accountTab";

export default function Page() {
  const scores = {
    [`scores2`]: [
      1, 4, 4, 5, 5, 3, 3, 2, 3, 4, 5, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 4,
      4, 4, 5, 4, 6, 6, 6, 6, 7, 4, 5, 6, 2, 5, 4, 3, 2, 4, 2, 3, 5, 6, 7, 4, 4,
      4, 5, 4, 6, 6, 6, 6, 7, 4, 5, 6, 2, 5, 4, 3, 2, 4, 2, 3, 5, 6, 7, 4, 4, 4,
      5, 4, 6, 6, 6, 6, 7, 4, 5, 6, 2, 5, 4, 3, 2, 4, 2, 3, 5, 6, 7, 4, 4, 4, 5,
      4, 6, 6, 6, 6, 7, 4, 5, 6, 2, 5, 4, 3, 2, 4, 2, 3, 5, 6, 7, 4, 4, 4, 5, 4,
      6, 6, 6, 6, 7, 4, 5, 6, 2, 5, 4, 3, 2, 4, 2, 3, 5, 6, 7, 6, 6, 6, 6, 6, 6,
      1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 3,
      3, 3, 3, 3, 3, 4, 6, 6, 6, 6, 7, 4, 5, 6, 2, 5, 4, 3, 2, 4, 2, 3, 5, 6, 7,
      4, 4, 4, 5, 4, 6, 6, 6, 6, 7, 4, 5, 6, 2, 5, 4, 3, 2, 4, 2, 3, 5, 6, 7, 6,
      6, 6, 6, 6, 6,
    ],
    [`scores3`]: [4, 5, 4, 7, 6, 2, 2, 1],
    [`scores4`]: [5, 6, 7, 7, 4, 4, 5, 6],
    [`scores5`]: [5, 6, 3, 2, 4, 5, 5, 3],
    [`scores7`]: [5, 6, 3, 2, 4, 5, 5, 3],
  };
  const averages = {
    [`average2`]: 3.131,
    [`average3`]: 3.531,
    [`average4`]: 3.931,
    [`average5`]: 4.331,
    [`average7`]: 5.531,
  };

  const tabs: TabItem[] = [
    {
      label: "Game Statistics",
      content: <StatsManager averages={averages} scores={scores} />,
      style: { flex: "3" },
    },
    {
      label: "Account Settings",
      content: <AccountTab />,
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
