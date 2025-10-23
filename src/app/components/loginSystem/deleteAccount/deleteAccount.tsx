"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./deleteAccount.module.css";
import classNames from "classnames";
import InputWrapper from "@/app/components/inputs/Text Input Wrapper - Trendy/input_wrapper";
import Button from "@/app/components/buttons/Button Set/button";
import ArrowLoader from "@/app/components/loaders/arrow_loader";
import Modal from "@/app/components/Modal Versatile Portal/modal";
import { useRouter } from "next/navigation";

interface DeleteAccount {
  closeFunction: () => void;
  style?: React.CSSProperties;
}

export default function DeleteAccount({ closeFunction, style }: DeleteAccount) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  // State for form data and errors
  const form = {
    email: "",
  };
  const [formData, setFormData] = useState(form);
  const [formErrors, setFormErrors] = useState(form);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  const [panel, setPanel] = useState<"loading" | "confirmation" | "default">(
    "default"
  );
  // Focuses the input on mount
  /*
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setButtonDisabled(true);
    setFormErrors(form);
    let errors = { ...form };
    const emailRegExp = new RegExp(
      "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,128})$"
    );
    if (!emailRegExp.test(formData.email)) {
      errors.email = `Enter your email`;
      setFormErrors(errors);
      setButtonDisabled(false);
      return;
    }
    setPanel("confirmation");
  }

  // Handle form submission
  async function deleteAccount() {
    try {
      setPanel("loading");
      const options = {
        method: "DELETE",
        body: JSON.stringify({ ...formData }),
        headers: { "Content-Type": "application/json" },
      };
      const res = await fetch("/api/auth/deleteAccount", options);
      const data = await res.json();
      if (data.errors) {
        if (data.errors.logout) {
          router.push("/login");
        }
        setFormErrors(data.errors);
        setButtonDisabled(false);
        setPanel("default");
        return;
      }
      if (data.success) {
        router.push("/delete-completed");
      } else {
        throw new Error();
      }
    } catch {
      let errors = { ...form };
      errors.email = `Something went wrong. Try again soon.`;
      setFormErrors(errors);
      setButtonDisabled(false);
      setPanel("default");
      return;
    }
  }

  return (
    <>
      {panel === "loading" && (
        <Modal unstyled={true} closeOnEscape={false} closeFunction={() => {}}>
          <div
            tabIndex={0}
            aria-label="Deleting your account. Please wait..."
            style={{
              position: "absolute",
              top: "100vh",
              width: "0",
              height: "0",
            }}
          />
          <ArrowLoader />
        </Modal>
      )}
      {panel === "confirmation" && (
        <Modal closeButton={false} closeFunction={closeFunction}>
          <div
            className={styles.delete_account_container}
            aria-label="Delete Confirmation Container"
          >
            <div
              className={styles.message}
            >{`Are you sure you want to delete your account?`}</div>
            <div className={styles.buttons_wrapper}>
              <Button
                variant="tertiary"
                onClick={closeFunction}
              >{`Cancel`}</Button>
              <Button variant="red" onClick={deleteAccount}>{`Delete`}</Button>
            </div>
          </div>
        </Modal>
      )}
      {panel === "default" && (
        <Modal closeButton={true} closeFunction={closeFunction}>
          <div
            className={styles.delete_account_container}
            aria-label="Delete Account Container"
          >
            <div>{"Enter your email to delete your account."}</div>
            <form
              className={styles.delete_account_form}
              onSubmit={handleSubmit}
              aria-label="Delete Account Form"
            >
              <InputWrapper
                label="Email"
                id="email"
                name="email"
                type="text"
                maxLength={256}
                value={formData.email}
                onChange={handleChange}
                inputRef={inputRef}
                error={formErrors.email}
                ariaDescribedBy="email-error"
              />
              <div className={styles.button_container}>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={buttonDisabled}
                >
                  {`Delete Account`}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
}
