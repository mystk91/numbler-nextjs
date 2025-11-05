"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "../policy.module.css";
import classNames from "classnames";

interface Props {
  style?: React.CSSProperties;
}

export default function PrivacyPolicy({ style }: Props) {
  return (
    <div style={{ ...style }} className={styles.policy}>
      <h1>Numbler Privacy Policy</h1>

      <section>
        <h2>Introduction</h2>
        <p>
          This Privacy Policy describes how Numbler collects, uses, and protects
          your information when you use our number guessing game website and
          services.
        </p>
      </section>

      <section>
        <h2>Information We Collect</h2>

        <h3>Account Information</h3>
        <p>When you create an account, we collect:</p>
        <ul>
          <li>
            <strong>Email address:</strong> Used for account management, login,
            and communication
          </li>
          <li>
            <strong>Password:</strong> Stored in hashed format for security
          </li>
          <li>
            <strong>Third-Party Profile Data:</strong> If you sign up through
            third-party authentication services, we may collect your email,
            profile picture, and basic profile information. These accounts may
            be linked to existing email accounts for unified access.
          </li>
        </ul>

        <h3>Game Data</h3>
        <p>When you complete games, the site may collect:</p>
        <ul>
          <li>
            <strong>Game scores and gameplay data:</strong> To display your
            personal performance and progress, and for improving the service
          </li>
        </ul>

        <h3>Technical Information</h3>
        <p>The site may automatically collect:</p>
        <ul>
          <li>
            <strong>Usage analytics:</strong> Basic, non-invasive statistics
            about site usage and game performance
          </li>
        </ul>
      </section>

      <section>
        <h2>Cookies and Local Storage</h2>
        <p>The site uses cookies and browser storage technologies:</p>
        <ul>
          <li>
            <strong>Essential Cookies and Storage:</strong> Necessary for login
            sessions, game progress, and site functionality
          </li>
          <li>
            <strong>Third-Party Cookies:</strong> May be used by third-party
            services for various purposes including advertising and analytics
          </li>
        </ul>
        <p>
          Game progress for non-registered users is stored locally in your
          browser.
        </p>
      </section>

      <section>
        <h2>How Your Information is Used</h2>
        <ul>
          <li>Provide and maintain the game service</li>
          <li>Manage your account and enable login functionality</li>
          <li>Maintain game sessions and save progress</li>
          <li>Track your personal game statistics and progress</li>
          <li>Send account-related emails (verification, password resets)</li>
          <li>Analyze gameplay trends and improve the service</li>
          <li>Store user preferences and game settings</li>
        </ul>
      </section>

      <section>
        <h2>Data Sharing and Disclosure</h2>
        <p>
          Personal information is not sold, traded, or rented to third parties.
          Information may be shared only in these limited circumstances:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong> With third-party services that
            help operate the website (authentication services, email delivery,
            data storage)
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by law
          </li>
          <li>
            <strong>Aggregated Data:</strong> Anonymized, aggregated statistics
            may be shared
          </li>
        </ul>
      </section>

      <section>
        <h2>Advertising</h2>
        <p>
          The site may display advertisements and use third-party advertising
          services. Advertising partners may use cookies and similar
          technologies for ad personalization and operate under their own
          privacy policies.
        </p>
      </section>

      <section>
        <h2>Data Security</h2>
        <p>
          Appropriate security measures are implemented to protect your
          information, including password hashing and secure data transmission.
          However, no method of transmission over the internet is 100% secure.
        </p>
      </section>

      <section>
        <h2>Your Rights and Choices</h2>
        <ul>
          <li>
            <strong>Account Access:</strong> You can access and update your
            account information at any time
          </li>
          <li>
            <strong>Account Deletion:</strong> You may delete your account,
            which will remove your personal information and game statistics
          </li>
          <li>
            <strong>Data Retention:</strong> Personal data is retained while
            your account is active and for a reasonable period after deletion to
            fulfill legal obligations. Some aggregated, anonymized gameplay
            statistics may be retained for service improvement even after
            account deletion
          </li>
          <li>
            <strong>Age Requirement:</strong> You must be at least 13 years of
            age to use this website
          </li>
        </ul>
      </section>

      <section>
        <h2>Third-Party Services</h2>
        <p>
          The site uses third-party services for authentication, email delivery,
          and data storage. These services operate under their own privacy
          policies.
        </p>
      </section>

      <section>
        <h2>Changes to This Privacy Policy</h2>
        <p>
          This Privacy Policy may be updated from time to time. Any changes will
          be posted on this page. Continued use of the site after changes are
          posted means you accept the updated policy.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at support@numbler.net
        </p>
      </section>
    </div>
  );
}
