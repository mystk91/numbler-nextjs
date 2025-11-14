"use client";
import React from "react";
import styles from "./homepage.module.css";
import HomepageLink from "./homepageLink/homepageLink";
import classNames from "classnames";

export default function Homepage() {
  return (
    <div className={styles.homepage}>
      <h1>{`Game Modes`}</h1>
      <div className={styles.links_wrapper}>
        <HomepageLink digits={2} />
        <HomepageLink digits={3} />
        <HomepageLink digits={4} recommended={true} />
        <HomepageLink digits={5} />
        <HomepageLink digits={6} />
        <HomepageLink digits={7} />
      </div>
    </div>
  );
}
