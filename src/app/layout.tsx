import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Numbler",
  themeColor: `#434360`,
  description: `A number guessing game. Use hints to zero in on the correct number!`,
  openGraph: {
    title: "Numbler",
    description:
      "A number guessing game. Use hints to zero in on the correct number!",
    url: "https://numbler.net",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Numbler",
    description:
      "A number guessing game. Use hints to zero in on the correct number!",
    images: ["/twitter-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
