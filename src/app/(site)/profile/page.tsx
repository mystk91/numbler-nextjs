import styles from "./page.module.css";
import type { Metadata } from "next";
import Profile from "@/app/components/icons/profile";
import { getCurrentUser } from "@/app/lib/auth/getCurrentUser";
import { redirect } from "next/navigation";
import TabContainer from "@/app/components/Tabs Container/tabsContainer";
import { TabItem } from "@/app/components/Tabs Container/tabsContainer";
import StatsManager from "@/app/components/Tab Statistics/StatsManager/statsManager";
import InfoTab from "@/app/components/Tab Info/infoTab";
import { connectToDatabase } from "@/app/lib/mongodb";

export const metadata: Metadata = {
  title: "Numbler - Profile",
  description: "Your profile for Numbler",
};

export default async function ProfilePage() {
  // Retrieve the users scores, in a form like: user = {scores2: [5,4,3]}
  const user = await getCurrentUser([
    "scores2",
    "scores3",
    "scores4",
    "scores5",
    "scores6",
    "scores7",
  ]);
  if (!user) {
    redirect("/login");
  }
  const analytics = await connectToDatabase("analytics");
  const game_stats = analytics.collection("game_stats");
  const averages = await game_stats.findOne({ name: "averages" });
  const averagesObj = {
    [`average2`]: averages && averages.averages2 ? averages.averages2 : 0,
    [`average3`]: averages && averages.averages3 ? averages.averages3 : 0,
    [`average4`]: averages && averages.averages4 ? averages.averages4 : 0,
    [`average5`]: averages && averages.averages5 ? averages.averages5 : 0,
    [`average6`]: averages && averages.averages6 ? averages.averages6 : 0,
    [`average7`]: averages && averages.averages7 ? averages.averages7 : 0,
  };
  const tabs: TabItem[] = [
    {
      label: "Game Statistics",
      content: <StatsManager averages={averagesObj} scores={user} />,
      style: { flex: "3" },
    },
    {
      label: "Account & Info",
      content: <InfoTab />,
      style: { flex: "2" },
    },
  ];

  return (
    <div className={styles.profile_wrapper}>
      <TabContainer tabs={tabs} />
    </div>
  );
}
