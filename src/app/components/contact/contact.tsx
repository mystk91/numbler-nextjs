"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./contact.module.css";
import classNames from "classnames";
import MailIcon from "@/app/components/icons/mail";

interface ContactProps {
  style?: React.CSSProperties;
}

export default function Contact({ style }: ContactProps) {
  return (
    <div style={{ ...style }} className={styles.contact_wrapper}>
      <div className={styles.contact}>
        <section className={styles.contact_section}>
          <h1>{`Contact Us`}</h1>
          <div className={styles.contact_message_wrapper}>
            <div
              className={styles.contact_message}
            >{`For any questions, issues, feedback, or general inquiries, feel free to reach out at:`}</div>
            <div className={styles.email_wrapper}>
              <MailIcon style={{ height: "1.2rem", width: "auto" }} />
              <div className={styles.email}>{`support@numbler.net`}</div>
            </div>
          </div>
        </section>
        <section className={styles.faq_section}>
          <h2>{`Frequently Asked Questions`}</h2>
          <div className={styles.faq_items_wrapper}>
            <div className={styles.faq_item}>
              <h3>{`I found a bug or have an account issue. What should I do?`}</h3>
              <div>{`Email us with details about the problem.`}</div>
              <div className={styles.tab_item}>
                <div>{`-`}</div>
                <div>
                  {`For bugs, include your browser and device information.`}
                </div>
              </div>
              <div className={styles.tab_item}>
                <div>{`-`}</div>
                <div>{`For account issues, please email from the address associated with your account.`}</div>
              </div>
            </div>
            <div className={styles.faq_item}>
              <h3>{`How do I change my password?`}</h3>
              <div>
                {`You can reset your password `}
                <Link href="/reset-password">{`here`}</Link>
                {`.`}
              </div>
              <div></div>
            </div>
            <div className={styles.faq_item}>
              <h3>{`How can I delete my account?`}</h3>
              <div>{`You can delete your account in the Account Settings tab of your profile.`}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
