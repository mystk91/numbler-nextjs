import Game from "@/app/components/game/game/game";
export const metadata: Metadata = {
  title: "Numbler - 5 Digits",
  description: "Play the 5 digit version of Numbler",
};

export default function Page() {
  return <Game digits={5} />;
}
