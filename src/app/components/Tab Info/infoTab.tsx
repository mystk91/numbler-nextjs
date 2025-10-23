"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./infoTab.module.css";
import classNames from "classnames";
import DeleteAccount from "@/app/components/loginSystem/deleteAccount/deleteAccount";

export default function InfoTab() {
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  return (
    <div className={styles.info_tab}>
      <div className={styles.top_wrapper}>
        <div className={styles.pillar_decoration}></div>
        {showDeleteAccount && (
          <DeleteAccount closeFunction={() => setShowDeleteAccount(false)} />
        )}
        <div className={styles.sections_wrapper}>
          <section>
            <h1>{`Account`}</h1>
            <div className={styles.links_wrapper}>
              <Link
                href={"/password-reset"}
                target="_blank"
              >{`Change Password`}</Link>
              <button
                className={styles.link_button}
                onClick={() => setShowDeleteAccount(true)}
              >{`Delete Account`}</button>
            </div>
          </section>
          <section>
            <h1>{`Site Info`}</h1>
            <div className={styles.links_wrapper}>
              <Link
                href={"/policy/tos"}
                target="_blank"
              >{`Terms of Service`}</Link>
              <Link
                href={"/policy/privacy"}
                target="_blank"
              >{`Privacy Policy`}</Link>
            </div>
          </section>
        </div>
        <div className={styles.pillar_decoration}></div>
      </div>
      <div className={styles.bottom_wrapper}>
        <div className={styles.bar_decoration}></div>
      </div>
    </div>
  );
}
