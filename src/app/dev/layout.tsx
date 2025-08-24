import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Testing Grounds",
  themeColor: `#434360`,
  description: `We are checking if things work here!`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <div id="modal"></div>
    </>
  );
}
