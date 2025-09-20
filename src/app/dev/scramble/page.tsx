"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { scramble } from "@/app/functions/scramble";
import { descramble } from "@/app/functions/descramble";
import Button from "@/app/components/buttons/Button Set/button";
import { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    scramble: "",
    descramble: "",
  });
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const [scrambleResult, setScrambleResult] = useState(``);
  const [descrambleResult, setDescrambleResult] = useState(``);

  function handleScramble(e: React.FormEvent) {
    e.preventDefault();
    setScrambleResult(scramble(formData.scramble));
  }

  function handleDescramble(e: React.FormEvent) {
    e.preventDefault();
    setDescrambleResult(descramble(formData.descramble));
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.scramble_wrapper}>
          <form onSubmit={handleScramble}>
            <input
              id="scramble"
              name="scramble"
              type="text"
              value={formData.scramble}
              onChange={handleChange}
            />
            <Button type="submit" variant="primary">{`Scramble`}</Button>
          </form>
          <div>{scrambleResult}</div>
        </div>
        <div className={styles.scramble_wrapper}>
          <form onSubmit={handleDescramble}>
            <input
              id="descramble"
              name="descramble"
              type="text"
              value={formData.descramble}
              onChange={handleChange}
            />
            <Button variant="primary" type="submit">{`Decramble`}</Button>
          </form>
          <div>{descrambleResult}</div>
        </div>
      </div>
    </div>
  );
}
