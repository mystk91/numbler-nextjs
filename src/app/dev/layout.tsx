import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "@/app/globals.css";
import { User, UserProvider } from "@/app/contexts/userContext";

export const metadata: Metadata = {
  title: "Testing Grounds",
  description: `We are checking if things work here!`,
};

export const viewport: Viewport = {
  themeColor: `#434360`,
};

// Checks if user has valid session
async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  try {
    const session = cookieStore.get("sessionId");
    if (session) {
      // Here we need to verify they have a valid session in our database

      // For now we'll just use a session called "testValue"
      if (session.value === "testValue") {
        return {
          session: "testValue",
          avatar: "",
        };
      }
    }
    throw Error(`User not found`);
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <UserProvider user={user}>
      {children}
      <div id="modal"></div>
    </UserProvider>
  );
}
