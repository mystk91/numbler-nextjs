"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import classNames from "classnames";
import DropdownMenu from "@/app/components/dropdownMenu/dropdownMenu";
import { Item } from "@/app/components/dropdownMenu/dropdownMenu";
import NavbarButton from "@/app/components/buttons/navbarButton/navbarButton";
import NumblerIcon from "@/app/components/icons/numbler";
import QuestionMark from "@/app/components/icons/questionMark";
import ProfileLoggedIn from "@/app/components/icons/profile_logged_in";
import ProfileIcon from "@/app/components/icons/profile";
import Modal from "@/app/components/Modal Versatile Portal/modal";
import Instructions from "@/app/components/navbar/instructions/instructions";
import Login from "@/app/components/loginSystem/login/login";
import Rectangle from "@/app/components/game/rectangle/rectangle";
import { useUser } from "@/app/contexts/userContext";

const linksMenu: Item[] = [
  { type: "link", label: "2 Digits", href: "/digits2" },
  { type: "link", label: "3 Digits", href: "/digits3" },
  { type: "link", label: "4 Digits", href: "/digits4" },
  { type: "link", label: "5 Digits", href: "/digits5" },
  { type: "link", label: "6 Digits", href: "/digits6" },
  { type: "link", label: "7 Digits", href: "/digits7" },
];

type Digit = 2 | 3 | 4 | 5 | 6 | 7 | undefined;
const gameModes = [2, 3, 4, 5, 6, 7];
4;
interface NavbarProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  showLoginButton?: boolean;
  digits?: Digit;
  style?: React.CSSProperties;
}

export default function Navbar({
  digits,
  containerRef,
  showLoginButton = true,
  style,
}: NavbarProps) {
  const user = useUser();
  const profileMenu: Item[] = user
    ? [
        { type: "link", label: "Your Account", href: "/account" },
        {
          type: "action",
          label: "Logout",
          onClick: async () => {
            try {
              const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
              };
              fetch("/api/auth/logout", options);
              window.location.reload();
            } catch {}
          },
        },
      ]
    : [];
  const [initalized, setInitialized] = useState(false);
  const [mobileSize, setMobileSize] = useState(false);

  // Handling modals for the navbar
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Needed since the navbar is in a layout
  const pathname = usePathname();
  useEffect(() => {
    setShowInstructions(false);
    setShowLogin(false);
  }, [pathname]);

  // Showing instructions on first visit to a game
  useEffect(() => {
    if (!digits) return;
    const visited = localStorage.getItem("visited");
    if (!visited && !user) {
      setShowInstructions(true);
    }
    const date = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      })
    );
    const dateString = `${date.getMonth() + 1}-${date.getDate()}`;
    localStorage.setItem("visited", dateString);
  }, [digits]);

  //componentDidMount, runs when component mounts and returns on dismount
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    setInitialized(true);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleResize() {
    setMobileSize(window.innerWidth < 875);
  }

  return !initalized ? (
    <nav className={styles.navbar}></nav>
  ) : (
    <nav style={{ ...style }} className={classNames(styles.navbar)}>
      {mobileSize ? (
        <div className={styles.game_mode_links}>
          <DropdownMenu
            menu={linksMenu}
            buttonStyle={{
              padding: "0",
              width: "9rem",
              display: "flex",
              justifyContent: "center",
            }}
            label={
              <div
                style={{
                  position: "absolute",
                  width: "6.48rem",
                  height: "100%",
                }}
                role="image"
              >
                {["", "", "", "", "", digits ? digits : "4"].map((value, i) => {
                  return (
                    <Rectangle
                      color="none"
                      type="digit"
                      value={
                        value as
                          | ""
                          | 0
                          | 1
                          | 2
                          | 3
                          | 4
                          | 5
                          | 6
                          | 7
                          | 8
                          | 9
                          | "equals"
                          | "higher"
                          | "lower"
                      }
                      style={{
                        borderColor:
                          i === 5 ? "var(--grey-text)" : "var(--grey)",
                        backgroundColor:
                          i === 5 ? "var(--lower-color)" : "var(--lower-color)",
                        color:
                          i === 5 ? "var(--grey-text)" : "var(--grey-text)",
                        borderWidth: i === 5 ? "0.3rem" : "0.2rem",
                        width: "3.6rem",
                        height: "auto",
                        minHeight: "0rem",
                        transform: `translateX(${i * 16}%) translateY(${
                          9 + i * 2
                        }%)`,
                        position: "absolute",
                      }}
                      key={i}
                      ariaLabel={""}
                    />
                  );
                })}
              </div>
            }
            containerRef={containerRef}
            title={`Games Modes`}
          />
        </div>
      ) : (
        <div className={styles.game_mode_links}>
          <div className={styles.links_wrapper}>
            {gameModes.map((n) => (
              <Link key={n} href={`/digits${n}`}>
                <NavbarButton tabIndex={-1}>
                  <Rectangle
                    color="none"
                    type="digit"
                    value={
                      n as
                        | ""
                        | 0
                        | 1
                        | 2
                        | 3
                        | 4
                        | 5
                        | 6
                        | 7
                        | 8
                        | 9
                        | "equals"
                        | "higher"
                        | "lower"
                    }
                    style={{
                      borderColor:
                        n === digits ? "var(--grey-text)" : "var(--grey)",
                      backgroundColor:
                        n === digits
                          ? "var(--lower-color)"
                          : "var(--lower-color)",
                      color:
                        n === digits ? "var(--grey-text)" : "var(--grey-text)",
                      borderWidth: n === digits ? "0.3rem" : "0.2rem",
                      minHeight: "4.8rem",
                    }}
                    ariaLabel={`Go to the ${n} digit mode of Numbler`}
                  />
                </NavbarButton>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className={styles.logo_wrapper} aria-label="Numbler logo">
        <Link href="/">
          <NumblerIcon />
        </Link>
      </div>
      <div className={styles.menu_icons}>
        {digits && (
          <NavbarButton
            title={"Game Instructions"}
            aria-label="Click to open the game instructions"
            onClick={() => setShowInstructions(true)}
            style={{ padding: "1.2rem", width: "4.8rem" }}
          >
            <QuestionMark style={{ transform: "translateX(-2px)" }} />
          </NavbarButton>
        )}
        {user ? (
          <DropdownMenu
            menu={profileMenu}
            label={
              user && user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Profile picture"
                  width={256}
                  height={256}
                  style={{
                    height: "100%",
                    width: "auto",
                    borderRadius: "5rem",
                    padding: "0.3rem",
                  }}
                />
              ) : (
                <ProfileLoggedIn style={{ padding: "0.4rem" }} />
              )
            }
            containerRef={containerRef}
            title="Your Profile"
          />
        ) : (
          showLoginButton && (
            <NavbarButton
              title="Login"
              aria-label="Click to open the login panel"
              onClick={() => setShowLogin(true)}
              style={{ padding: "0.8rem", width: "6.4rem" }}
            >
              <ProfileIcon />
            </NavbarButton>
          )
        )}
      </div>
      {showInstructions && (
        <Modal
          closeFunction={() => setShowInstructions(false)}
          closeButton={true}
          closeOnBackdropClick={true}
          animate={true}
        >
          <Instructions digits={Number(digits) < 5 ? "4" : "5"} />
        </Modal>
      )}
      {showLogin && (
        <Modal
          closeFunction={() => setShowLogin(false)}
          closeButton={true}
          closeOnBackdropClick={true}
          animate={true}
          modalStyle={{ paddingTop: "0.4rem", paddingBottom: "0rem" }}
        >
          <Login
            style={{ border: "none" }}
            onNavigate={() => setShowLogin(false)}
          />
        </Modal>
      )}
    </nav>
  );
}
