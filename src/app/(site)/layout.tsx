"use client";
import Navbar from "@/app/components/navbar/navbar";
import styles from "./page.module.css";
import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const containerRef = useRef<null | HTMLDivElement>(null);
  const [digits, setDigits] = useState<2 | 3 | 4 | 5 | 6 | 7 | undefined>(
    undefined
  );
  const [showLoginButton, setShowLoginButton] = useState(false);

  // Used to update the navbar when user changes pages
  function updateNavbar() {
    const arr = path.split(`/`);
    const page = arr[arr.length - 1];
    // Checks if we're on a game page
    if (arr.length === 2 && page.substring(0, page.length - 1) === `digits`) {
      const digit = Number(page[page.length - 1]);
      if ([2, 3, 4, 5, 6, 7].includes(digit)) {
        setDigits(digit as 2 | 3 | 4 | 5 | 6 | 7);
      } else {
        setDigits(undefined);
      }
    } else {
      setDigits(undefined);
    }
    // Checks if we're on the login page
    if (arr.length === 2 && page === "login") {
      setShowLoginButton(false);
    } else {
      setShowLoginButton(true);
    }
  }


  // Set --app-height for Android viewport fix
  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', setAppHeight);
    setAppHeight();
    return () => window.removeEventListener('resize', setAppHeight);
  }, []);

  useEffect(() => {
    updateNavbar();
  }, [path]);

  return (
    <div className={styles.page} ref={containerRef}>
      <Navbar
        digits={digits}
        containerRef={containerRef}
        showLoginButton={showLoginButton}
      />
      {children}
      <div id="modal"></div>
    </div>
  );
}
