import styles from "./page.module.css";
import type { Metadata } from "next";
import Login from "@/app/components/loginSystem/login/login";
import { getCurrentUser } from "@/app/lib/auth/getCurrentUser";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Numbler - Login",
  description: "Log in to your Numbler account",
};

export default async function LoginPage() {
  // Checks if user is logged in
  const user = await getCurrentUser();
  if (user && user.loggedIn) {
    redirect("/");
  }

  return (
    <div className={styles.login_wrapper}>
      <div>
        <Login />
      </div>
    </div>
  );
}
