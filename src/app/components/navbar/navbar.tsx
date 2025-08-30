"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
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

const linksMenu: Item[] = [
  { type: "link", label: "2 Digits", href: "/digits2" },
  { type: "link", label: "3 Digits", href: "/digits3" },
  { type: "link", label: "4 Digits", href: "/digits4" },
  { type: "link", label: "5 Digits", href: "/digits5" },
  { type: "link", label: "6 Digits", href: "/digits6" },
  { type: "link", label: "7 Digits", href: "/digits7" },
];

const profileMenu: Item[] = [
  { type: "link", label: "Your Profile", href: "/profile" },
  {
    type: "action",
    label: "Logout",
    onClick: () => {
      console.log("We logged out");
    },
  },
];

interface User {
  session?: any;
}

type Digit = 2 | 3 | 4 | 5 | 6 | 7 | undefined;
const gameModes = [2, 3, 4, 5, 6, 7];

interface NavbarProps {
  user: User;
  containerRef: React.RefObject<HTMLElement | null>;
  digits?: Digit;
  style?: React.CSSProperties;
}

export default function Navbar({
  user,
  digits,
  containerRef,
  style,
}: NavbarProps) {
  const [initalized, setInitialized] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [mobileSize, setMobileSize] = useState(false);

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
    <nav className={styles.navbar} style={{ opacity: "0" }}></nav>
  ) : (
    <nav style={{ ...style }} className={classNames(styles.navbar)}>
      {mobileSize ? (
        <div className={styles.game_mode_links}>
          <DropdownMenu
            menu={linksMenu}
            label="Game Modes"
            containerRef={containerRef}
            title={`Game Modes`}
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
                        | "higher"
                        | "lower"
                        | 2
                        | 3
                        | 4
                        | 5
                        | 6
                        | 7
                        | 8
                        | 9
                        | "equals"
                    }
                    style={{
                      borderColor: "var(--grey-text)",
                      backgroundColor:
                        n === digits ? "rgb(80, 80, 80)" : "var(--lower-color)",
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
        <NumblerIcon />
      </div>
      <div className={styles.menu_icons}>
        {digits && (
          <NavbarButton
            title={"Game Instructions"}
            aria-label="Click to open the game instructions"
            onClick={() => setShowInstructions(true)}
            style={{ padding: "1.2rem", width: "4.8rem" }}
          >
            <QuestionMark />
          </NavbarButton>
        )}
        {user.session ? (
          <DropdownMenu
            menu={profileMenu}
            label={<ProfileLoggedIn style={{ padding: "0.4rem" }} />}
            containerRef={containerRef}
            title="Your Profile"
          />
        ) : (
          <NavbarButton
            title="Login"
            aria-label="Click to open the login panel"
            onClick={() => setShowLogin(true)}
            style={{ padding: "0.8rem", width: "6.4rem" }}
          >
            <ProfileIcon />
          </NavbarButton>
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
        >
          <Login style={{ border: "none" }} />
        </Modal>
      )}
    </nav>
  );
}
