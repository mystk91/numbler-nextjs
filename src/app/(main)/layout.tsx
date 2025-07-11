import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Numbler",
  description: `A number guessing game. Use hints to zero in on the correct number!`,
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return { children };
}
