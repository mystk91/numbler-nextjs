"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./component.module.css";
import classNames from "classnames";

interface LoginProps {
  style?: React.CSSProperties;
}

export default function Login({ style }: LoginProps) {

  return <div style={{ ...style }}></div>;
}
