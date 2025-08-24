"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./login.module.css";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import InputWrapper from "@/app/components/inputs/Text Input Wrapper - Trendy/input_wrapper";
import Button from "@/app/components/buttons/Button Set/button";

interface LoginProps {
  style?: React.CSSProperties;
}

export default function Login({ style }: LoginProps) {
  const router = useRouter();
  //URLS
  const loginURL = "/api/auth/login";
  // Used to give focus to the form input on load
  /*
  const inputReference = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (inputReference.current) {
      inputReference.current.focus();
    }
  }, []);
  */

  // State for form data and errors
  const form = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(form);
  const [formErrors, setFormErrors] = useState(form);

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  // Handle login submission
  async function login(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors(form);
    if (validate()) {
      try {
        const options = {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        };
        const res = await fetch(loginURL, options);
        const data = await res.json();
        //console.log(dataLogin);
        if (!data.errors) {
          setFormErrors({
            email: ``,
            password: ``,
          });
          router.replace(data.redirectUrl);
        } else {
          setFormErrors(data.errors);
        }
      } catch {
        let errors = { ...form };
        errors.password = `Something went wrong. Try again soon.`;
        setFormErrors(errors);
      }
    }
  }

  //Checks to see if input fields are valid, returns true if valid, otherwise adds error messages and returns false
  function validate(): boolean {
    let emailRegExp = new RegExp(
      "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,128})$"
    );
    let passwordRegExp = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[!@#$%^&*_0-9]).{8,32}$"
    );
    //Checks if email address and password are valid
    if (
      !emailRegExp.test(formData.email) ||
      !passwordRegExp.test(formData.password)
    ) {
      let errors = { ...form };
      errors.password = `Incorrect username or password`;
      setFormErrors(errors);
      return false;
    } else return true;
  }

  //Sends user to google login
  function googleLogin() {
    router.push("/api/auth/google");
  }

  return (
    <div
      className={styles.login_container}
      aria-label="Login Container"
      style={{ ...style }}
    >
      <h1>{`Sign in`}</h1>
      <form
        className={styles.login_form}
        onSubmit={login}
        aria-label="Login Form"
      >
        <InputWrapper
          label="Email"
          id="email"
          name="email"
          type="text"
          value={formData.email}
          onChange={handleChange}
          //inputRef={inputReference}
          error={formErrors.email}
          ariaDescribedBy="email-error"
          maxLength={128}
        />
        <InputWrapper
          label="Password"
          id="password"
          name="password"
          type="password"
          value={formData.password}
          togglePassword={true}
          onChange={handleChange}
          error={formErrors.password}
          ariaDescribedBy="password-error"
          maxLength={32}
        />
        <div className={styles.button_container}>
          <Button variant="primary" type="submit" width="full">
            {`Sign in`}
          </Button>
        </div>
      </form>
      <div className={styles.links_container}>
        <div className={styles.signup_link_container}>
          {`Not a member?`}&nbsp;
          <a href="/signup">{`Sign up!`}</a>
        </div>
        <a
          href="/password-reset"
          className={styles.forgot_password}
        >{`Forgot Password?`}</a>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.login_options}>
        <Button
          variant="tertiary"
          icon={
            <Image
              src={"/login/google-logo.jpg"}
              alt="Google Logo"
              width="24"
              height="24"
              style={{ padding: "0.4rem" }}
            />
          }
          text="Login with Google"
          onClick={googleLogin}
          width="full"
        />
      </div>
    </div>
  );
}
