import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "@/app/globals.css";
import { User, UserProvider } from "@/app/contexts/userContext";
import { getCurrentUser } from "@/app/lib/auth/getCurrentUser";

export const metadata: Metadata = {
  title: "Testing Grounds",
  description: `We are checking if things work here!`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser(["avatar"]);
  return (
    <UserProvider user={user}>
      {children}
      <div id="modal"></div>
    </UserProvider>
  );
}
