import Game from "@/app/components/game/game/game";
export const metadata: Metadata = {
  title: "Numbler - 2 Digits",
  description: "Play the 2 digit version of Numbler",
};

export default function Page() {
  return <Game digits={2} />;
}
