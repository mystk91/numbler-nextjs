import Game from "@/app/components/game/game/game";
export const metadata: Metadata = {
  title: "Numbler - 6 Digits",
  description: "Play the 6 digit version of Numbler",
};

export default function Page() {
  return <Game digits={6} />;
}
