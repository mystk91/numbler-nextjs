"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./passwordReset.module.css";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import InputWrapper from "@/app/components/inputs/Text Input Wrapper - Trendy/input_wrapper";
import Button from "@/app/components/buttons/Button Set/button";

interface widthProps {
  style?: React.CSSProperties;
}

export default function width({ style }: widthProps) {
  //URLS
  const resetUrl = "/api/auth/password_reset";
  // Used to give focus to the form input on load

  const inputReference = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputReference.current) {
      inputReference.current.focus();
    }
  }, []);

  const router = useRouter();

  const [emailSent, setEmailSent] = useState(false);

  // State for form data and errors
  const form = {
    email: "",
  };
  const [formData, setFormData] = useState(form);
  const [formErrors, setFormErrors] = useState(form);

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }
  // Handle login submission
  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors(form);
    if (validate()) {
      try {
        const options = {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        };
        const res = await fetch(resetUrl, options);
        //const data = await res.json();
        //if (!data.errors) {
        if (true) {
          setFormErrors({
            email: ``,
          });
          setEmailSent(true);
        } else {
          //setFormErrors(data.errors);
        }
      } catch {
        let errors = { ...form };
        errors.email = `Something went wrong. Try again soon.`;
        setFormErrors(errors);
      }
    }
  }

  //Checks to see if input fields are valid, returns true if valid, otherwise adds error messages and returns false
  function validate(): boolean {
    let emailRegExp = new RegExp(
      "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,256})$"
    );
    //Checks if email address is valid
    if (!emailRegExp.test(formData.email)) {
      let errors = { ...form };
      errors.email = `Enter a valid email`;
      setFormErrors(errors);
      return false;
    } else return true;
  }

  return emailSent ? (
    <div
      className={styles.reset_container}
      aria-label="Password Sent Message"
      style={{ ...style }}
    >
      <div
        className={styles.message}
      >{`We've sent a password reset link to your email if it's associated with an account.`}</div>
      <Button
        variant="primary"
        width="full"
        style={{ width: "80%" }}
        onClick={() => router.push("/login")}
      >
        {`Go to Login`}
      </Button>
    </div>
  ) : (
    <div
      className={styles.reset_container}
      aria-label="Password Reset Container"
      style={{ ...style }}
    >
      <form
        className={styles.reset_form}
        onSubmit={resetPassword}
        aria-label="Password Reset Form"
      >
        <InputWrapper
          label="Email"
          id="email"
          name="email"
          type="text"
          maxLength={132}
          value={formData.email}
          onChange={handleChange}
          inputRef={inputReference}
          error={formErrors.email}
          ariaDescribedBy="email-error"
        />
        <div className={styles.button_container}>
          <Button variant="primary" type="submit" style={{ width: "80%" }}>
            {`Send Password Reset`}
          </Button>
        </div>
      </form>
    </div>
  );
}
