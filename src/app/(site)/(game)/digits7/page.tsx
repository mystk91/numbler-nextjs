import Game from "@/app/components/game/game/game";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Numbler - 7 Digits",
  description: "Play the 7 digit version of Numbler",
};

export default function Page() {
  return <Game digits={7} />;
}
