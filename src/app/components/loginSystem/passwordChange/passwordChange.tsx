"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./passwordChange.module.css";
import classNames from "classnames";
import InputWrapper from "@/app/components/inputs/Text Input Wrapper - Trendy/input_wrapper";
import Button from "@/app/components/buttons/Button Set/button";
import ArrowLoader from "@/app/components/loaders/arrow_loader";

interface PasswordChangeProps {
  code: string;
}

export default function PasswordChange({ code }: PasswordChangeProps) {
  //URLS
  const changeUrl = "/api/auth/changePassword";
  const checkUrl = "/api/auth/checkPasswordCode";

  const inputReference = useRef<HTMLInputElement | null>(null);
  // Checks if the password change code is valid, then focuses the input on load
  useEffect(() => {
    checkPasswordCode();
  }, []);
  // Checks the password code from params
  async function checkPasswordCode() {
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ code: code }),
        headers: { "Content-Type": "application/json" },
      };
      const res = await fetch(checkUrl, options);
      const data = await res.json();
      if (data.errors) {
        setPanel("failure");
      } else {
        setPanel("change");
      }
    } catch {
      setPanel("failure");
    }
  }
  const [panel, setPanel] = useState<
    "success" | "failure" | "loading" | "change"
  >("loading");

  // Focuses the input once loading ends
  useEffect(() => {
    if (inputReference.current) {
      inputReference.current.focus();
    }
  }, [panel]);

  // State for form data and errors
  const form = {
    password: "",
    verify_password: "",
  };
  const [formData, setFormData] = useState(form);
  const [formErrors, setFormErrors] = useState(form);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  // Handle form submission
  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setButtonDisabled(true);
    setFormErrors(form);
    if (validate()) {
      try {
        setPanel("loading");
        const options = {
          method: "POST",
          body: JSON.stringify({ ...formData, code: code }),
          headers: { "Content-Type": "application/json" },
        };
        const res = await fetch(changeUrl, options);
        const data = await res.json();
        if (data.errors) {
          if (data.errors.alreadyChanged) {
            setPanel("failure");
          } else {
            setFormErrors(data.errors);
            setButtonDisabled(false);
            setPanel("change");
          }
          return;
        }
        setPanel("success");
      } catch {
        let errors = { ...form };
        errors.verify_password = `Something went wrong. Try again soon.`;
        setFormErrors(errors);
        setButtonDisabled(false);
        setPanel("change");
      }
    } else {
      setButtonDisabled(false);
    }
  }

  //Checks to see if input fields are valid, returns true if valid, otherwise adds error messages and returns false
  function validate(): boolean {
    let errors = { ...form };
    const passwordRegExp = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[!@#$%^&*_0-9]).{8,32}$"
    );
    if (!passwordRegExp.test(formData.password)) {
      errors.verify_password = `Make your password stronger`;
    } else if (formData.password !== formData.verify_password) {
      errors.verify_password = `Passwords do not match`;
    }
    setFormErrors(errors);
    const errorFound = Object.values(errors).some(Boolean);
    return !errorFound;
  }

  return (
    <>
      {panel === "loading" && <ArrowLoader />}
      {panel === "failure" && (
        <div
          className={styles.change_password_container}
          aria-label="Failure Message"
        >
          <div
            className={styles.message}
          >{`This password link has expired or does not exist.`}</div>
        </div>
      )}
      {panel === "success" && (
        <div
          className={styles.change_password_container}
          aria-label="Password Changed Message"
        >
          <div
            className={styles.message}
          >{`Your password has been changed.`}</div>
          <Link href="/login" style={{ width: "80%" }}>
            <Button variant="primary" width="full" tabIndex={-1}>
              {`Go to Login`}
            </Button>
          </Link>
        </div>
      )}
      {panel === "change" && (
        <div
          className={styles.change_password_container}
          aria-label="Change Password Container"
        >
          <form
            className={styles.change_password_form}
            onSubmit={changePassword}
            aria-label="Change Password Form"
          >
            <InputWrapper
              label="Password"
              id="password"
              name="password"
              type="password"
              togglePassword={true}
              maxLength={32}
              value={formData.password}
              onChange={handleChange}
              inputRef={inputReference}
              error={formErrors.password}
              ariaDescribedBy="password-error"
            />
            <InputWrapper
              label="Verify Password"
              id="verify_password"
              name="verify_password"
              type="password"
              togglePassword={true}
              maxLength={32}
              value={formData.verify_password}
              onChange={handleChange}
              error={formErrors.verify_password}
              ariaDescribedBy={`verify-password-error`}
            />
            <div className={styles.button_container}>
              <Button
                variant="primary"
                type="submit"
                style={{ width: "80%" }}
                disabled={buttonDisabled}
              >
                {`Change Password`}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
