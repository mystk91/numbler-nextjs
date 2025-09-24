"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/app/components/buttons/Button Set/button";
import InputWrapper from "@/app/components/inputs/Text Input Wrapper - Trendy/input_wrapper";
import classNames from "classnames";
import styles from "./signup.module.css";
import ProgressBar from "@/app/components/Progress Bars/Progress Bar FullWidth/progressBar";

interface SignupProps {}

interface PanelProps {
  children: React.ReactNode;
  enterLeft: boolean;
  enterRight: boolean;
  closeLeft: boolean;
  closeRight: boolean;
  percent: number;
  transitionDuration?: string;
  buttonDisabled?: boolean;
  goBack?: () => void;
}

export function Panel({
  children,
  enterLeft,
  enterRight,
  closeLeft,
  closeRight,
  percent,
  transitionDuration = "",
  buttonDisabled = false,
  goBack,
}: PanelProps) {
  return (
    <div
      className={classNames(styles.panel_wrapper, {
        [styles.enterLeft]: enterLeft,
        [styles.enterRight]: enterRight,
        [styles.closeLeft]: closeLeft,
        [styles.closeRight]: closeRight,
      })}
    >
      {goBack && (
        <div className={styles.back_button}>
          <Button
            variant="tertiary"
            onClick={goBack}
            width="smallest"
            title="Go back"
            ariaLabel="Go back"
            disabled={buttonDisabled}
          >{`<`}</Button>
        </div>
      )}
      <ProgressBar
        percent={percent}
        percentStyle={{ transitionDuration: transitionDuration }}
      />
      <div className={classNames(styles.panel)}>{children}</div>
    </div>
  );
}

export default function Signup({}: SignupProps) {
  //For which panel we are currently showing
  type Panel = "email" | "password" | "success";
  const [panel, setPanel] = useState<Panel>("email");
  const [closeLeft, setCloseLeft] = useState(false);
  const [closeRight, setCloseRight] = useState(false);
  const [enterRight, setEnterRight] = useState(true);
  const [enterLeft, setEnterLeft] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  //For the progress bar
  const [percent, setPercent] = useState(0);
  //Form handling
  type Form = {
    email: string;
    password: string;
    verify_password: string;
  };
  const initialForm: Form = {
    email: "",
    password: "",
    verify_password: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState(initialForm);
  const panelInputs: Record<Panel, (keyof Form)[]> = {
    email: ["email"],
    password: ["password", "verify_password"],
    success: [],
  };

  //Clears the form on the inputed panel
  function clearPanelForm(panel: Panel) {
    setFormData((prev) => {
      const clearedFields = Object.fromEntries(
        panelInputs[panel].map((input) => [input, ""])
      );
      return {
        ...prev,
        ...clearedFields,
      };
    });
    setFormErrors((prev) => {
      const clearedErrors = Object.fromEntries(
        panelInputs[panel].map((input) => [input, ""])
      );
      return {
        ...prev,
        ...clearedErrors,
      };
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  //Checks if email is valid and continues the signup if it is
  async function submitEmail(e: FormEvent) {
    e.preventDefault();
    setFormErrors(initialForm);
    let errors = { ...initialForm };
    const emailRegExp = new RegExp(
      "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,128})$"
    );
    if (!emailRegExp.test(formData.email)) {
      errors.email = `Enter a valid email`;
    }
    const errorFound = Object.values(errors).some(Boolean);
    if (errorFound) {
      setFormErrors(errors);
      return;
    }
    nextPanel("password", 66);
  }

  async function submitPassword(e: FormEvent) {
    setTransitionDuration("2s");
    setPercent(80);
    setButtonDisabled(true);
    e.preventDefault();
    setFormErrors(initialForm);
    const passwordRegExp = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[!@#$%^&*_0-9]).{8,32}$"
    );
    let errors = { ...initialForm };
    if (!passwordRegExp.test(formData.password)) {
      errors.verify_password = `Make your password stronger`;
    } else if (formData.password !== formData.verify_password) {
      errors.verify_password = `Passwords do not match`;
    }
    const errorFound = Object.values(errors).some(Boolean);
    if (errorFound) {
      setFormErrors(errors);
      return;
    }
    const options = {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    };
    try {
      const res = await fetch("/api/auth/signup", options);
      const data = await res.json();
      if (data.errors) {
        throw new Error();
      } else {
        setTransitionDuration("");
        nextPanel("success", 99);
      }
    } catch {
      //This shouldn't happen usually
      goBack("email", "password", 33);
      clearPanelForm("email");
      clearPanelForm("password");
      let errors = { ...initialForm };
      errors.email = "Something went wrong. Try again soon.";
      setFormErrors(errors);
      setTransitionDuration("");
      setPercent(33);
      setButtonDisabled(false);
    }
  }

  function nextPanel(nextPanel: Panel, percent: number) {
    setPercent(percent);
    setEnterLeft(false);
    setCloseLeft(true);
    timeoutRef.current = setTimeout(() => {
      setCloseLeft(false);
      setPanel(nextPanel);
      setEnterRight(true);
      timeoutRef.current = setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }, 500);
  }

  function goBack(previousPanel: Panel, currentPanel: Panel, percent: number) {
    setPercent(percent);
    setEnterRight(false);
    setCloseRight(true);
    timeoutRef.current = setTimeout(() => {
      setCloseRight(false);
      setPanel(previousPanel);
      clearPanelForm(currentPanel);
      setEnterLeft(true);
    }, 500);
  }

  //Focuses the input field when a new panel appears
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, [panel]);

  //Runs when component mounts, and then when it dismounts
  useEffect(() => {
    setPercent(33);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.signup_wrapper}>
      {panel === "email" && (
        <Panel
          closeLeft={closeLeft}
          closeRight={closeRight}
          enterLeft={enterLeft}
          enterRight={enterRight}
          percent={percent}
          transitionDuration={transitionDuration}
        >
          <form onSubmit={submitEmail}>
            <InputWrapper
              id={`email_input`}
              name={`email`}
              label={`Email`}
              type={`text`}
              value={formData.email}
              onChange={handleChange}
              maxLength={128}
              ariaDescribedBy={`email-error`}
              error={formErrors.email}
              autocomplete="email"
              inputRef={inputRef}
            />
            <Button
              variant="primary"
              type="submit"
              style={{ width: "90%" }}
            >{`Next`}</Button>
          </form>
        </Panel>
      )}
      {panel === "password" && (
        <Panel
          closeLeft={closeLeft}
          closeRight={closeRight}
          enterLeft={enterLeft}
          enterRight={enterRight}
          percent={percent}
          transitionDuration={transitionDuration}
          buttonDisabled={buttonDisabled}
          goBack={() => goBack("email", "password", 33)}
        >
          <form onSubmit={submitPassword}>
            <div className={styles.inputs_wrapper}>
              <InputWrapper
                id={`password_input`}
                name={`password`}
                label={`Password`}
                type={`password`}
                value={formData.password}
                onChange={handleChange}
                maxLength={32}
                ariaDescribedBy={`password-error`}
                error={formErrors.password}
                autocomplete="password"
                togglePassword={true}
                inputRef={inputRef}
              />
              <InputWrapper
                id={`verify_password_input`}
                name={`verify_password`}
                label={`Verify Password`}
                type={`password`}
                value={formData.verify_password}
                onChange={handleChange}
                maxLength={32}
                ariaDescribedBy={`verify-password-error`}
                error={formErrors.verify_password}
                autocomplete="password"
                togglePassword={true}
              />
            </div>
            <Button
              variant="primary"
              type="submit"
              style={{ width: "90%" }}
              disabled={buttonDisabled}
            >{`Submit`}</Button>
          </form>
        </Panel>
      )}
      {panel === "success" && (
        <Panel
          closeLeft={closeLeft}
          closeRight={closeRight}
          enterLeft={enterLeft}
          enterRight={enterRight}
          percent={percent}
        >
          <div className={styles.success_message}>
            <div>{`You're almost there!`}</div>
            <div>{`Verify your email to create your account.`}</div>
          </div>
        </Panel>
      )}
    </div>
  );
}
