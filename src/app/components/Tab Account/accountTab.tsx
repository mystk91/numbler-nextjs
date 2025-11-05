"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./accountTab.module.css";
import classNames from "classnames";
import DeleteAccount from "@/app/components/loginSystem/deleteAccount/deleteAccount";
import Footer from "@/app/components/Footer/footer";

export default function AccountTab() {
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  return (
    <div className={styles.account_tab}>
      <div className={styles.top_wrapper}>
        {showDeleteAccount && (
          <DeleteAccount closeFunction={() => setShowDeleteAccount(false)} />
        )}
        <div className={styles.account_wrapper}>
          <div className={styles.sections_wrapper}>
            <section>
              <h1>{`Account Settings`}</h1>
              <div className={styles.links_wrapper}>
                <Link
                  href={"/reset-password"}
                  target="_blank"
                >{`Change Password`}</Link>
                <button
                  className={styles.link_button}
                  onClick={() => setShowDeleteAccount(true)}
                >{`Delete Account`}</button>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div className={styles.footer_wrapper}>
        <Footer />
      </div>
    </div>
  );
}
