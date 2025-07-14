"use client"
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";
import KeyboardButton from "@/app/components/buttons/keyboardButton/keyboardButton";
import Backspace from "@/app/svg/svg_backspace";


export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.numbers}>
        <KeyboardButton backgroundColor="none" width={"smallest"} onClick={()=>{}}>{`1`}</KeyboardButton>
        <KeyboardButton backgroundColor="yellow" width={"smallest"} onClick={()=>{}}>{`2`}</KeyboardButton>
        <KeyboardButton backgroundColor="none" width={"smallest"} onClick={()=>{}}>{`3`}</KeyboardButton>
        <KeyboardButton backgroundColor="grey" width={"smallest"} onClick={()=>{}}>{`4`}</KeyboardButton>
        <KeyboardButton backgroundColor="none" width={"smallest"} onClick={()=>{}}>{`5`}</KeyboardButton>
        <KeyboardButton backgroundColor="none" width={"smallest"} onClick={()=>{}}>{`6`}</KeyboardButton>
        <KeyboardButton backgroundColor="green" width={"smallest"} onClick={()=>{}}>{`7`}</KeyboardButton>
        <KeyboardButton backgroundColor="none" width={"smallest"} onClick={()=>{}}>{`8`}</KeyboardButton>
        <KeyboardButton backgroundColor="none" width={"smallest"} onClick={()=>{}}>{`9`}</KeyboardButton>
        <KeyboardButton backgroundColor="none" width={"smallest"} onClick={()=>{}}>{`0`}</KeyboardButton>
        </div>
        <div className={styles.inputs}>
        <KeyboardButton backgroundColor="none"  style={{width: `22rem`, height: `4.8rem`, fontSize: `1.8rem`}} width={"default"} onClick={()=>{}}>{`Enter`}</KeyboardButton>
        <KeyboardButton backgroundColor="none"  width={"smallest"} style={{height: `4.8rem`}}  onClick={()=>{}} icon={<Backspace />}></KeyboardButton>
        </div>
      </div>
    </div>
  );
}
