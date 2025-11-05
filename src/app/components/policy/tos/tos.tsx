"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "../policy.module.css";
import classNames from "classnames";

interface Props {
  style?: React.CSSProperties;
}

export default function TermsOfService({ style }: Props) {
  return (
    <div style={{ ...style }} className={styles.policy}>
      <h1>Numbler Terms of Service</h1>

      <section>
        <h2>Agreement to Terms</h2>
        <p>
          By using Numbler, you agree to be bound by these Terms of Service. If
          you do not agree to these terms, you may not use the website.
        </p>
      </section>

      <section>
        <h2>Description of Service</h2>
        <p>
          Numbler is a web-based number guessing game where players attempt to
          guess a target number within a limited number of attempts. The service
          includes optional user accounts, game statistics tracking, and related
          features.
        </p>
      </section>

      <section>
        <h2>User Accounts</h2>
        <h3>Account Creation</h3>
        <ul>
          <li>
            You may create an account using email/password or through
            third-party authentication services
          </li>
          <li>
            You are responsible for maintaining the security of your account
            credentials
          </li>
          <li>
            You must provide accurate information when creating an account
          </li>
          <li>You must be at least 13 years of age to create an account</li>
          <li>
            You are responsible for all activity that occurs under your account
          </li>
        </ul>

        <h3>Account Termination</h3>
        <ul>
          <li>You may delete your account at any time through the website</li>
          <li>
            Accounts that violate these terms may be suspended or terminated
          </li>
          <li>
            Upon account deletion, personal data will be removed as described in
            the Privacy Policy
          </li>
        </ul>
      </section>

      <section>
        <h2>Acceptable Use</h2>
        <p>You agree to use the website responsibly and not to:</p>
        <ul>
          <li>
            Attempt to gain unauthorized access to the website or its systems
          </li>
          <li>
            Use automated tools, bots, or scripts to interact with the game
          </li>
          <li>
            Engage in any activity that could harm or disrupt the website's
            operation
          </li>
          <li>Use the website for any unlawful purpose</li>
          <li>Attempt to circumvent game mechanics or cheat</li>
        </ul>
      </section>

      <section>
        <h2>User Content and Data</h2>
        <p>
          By using the website, you grant permission to store and process your
          data as described in the Privacy Policy.
        </p>
      </section>

      <section>
        <h2>Privacy and Data</h2>
        <p>
          Your use of the website is also governed by our Privacy Policy, which
          explains how we collect, use, and protect your information, including
          our use of cookies and local storage.
        </p>
      </section>

      <section>
        <h2>Service Availability</h2>
        <ul>
          <li>The website is provided on an "as available" basis</li>
          <li>
            We do not guarantee uninterrupted access or error-free operation
          </li>
          <li>We may modify, suspend, or discontinue features at any time</li>
          <li>
            The website may be temporarily unavailable for maintenance or
            technical issues
          </li>
          <li>
            In the event of ownership changes, reasonable efforts will be made
            to maintain service continuity and data protection
          </li>
        </ul>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          While we strive to maintain reliable operation, we cannot guarantee
          perfect uptime or data persistence. You use the website at your own
          risk, and we are not liable for any losses or damages that may result
          from your use of the service.
        </p>
      </section>

      <section>
        <h2>Advertising</h2>
        <p>
          The website may display advertisements to help support operating
          costs.
        </p>
      </section>

      <section>
        <h2>Changes to Terms</h2>
        <p>
          These Terms of Service may be updated periodically. Changes will be
          posted on this page, and your continued use of the website constitutes
          acceptance of any modifications.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          For questions regarding these Terms of Service, please contact
          support@numbler.net
        </p>
      </section>
    </div>
  );
}
