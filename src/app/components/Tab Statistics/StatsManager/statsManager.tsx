"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./statsManager.module.css";
import classNames from "classnames";
import StatsEntry from "../StatsEntry/statsEntry";
import { StatsEntryProps } from "../StatsEntry/statsEntry";
import TrashIcon from "@/app/components/icons/trash";
import Button from "@/app/components/buttons/Button Set/button";
import Modal from "@/app/components/Modal Versatile Portal/modal";
import ArrowLoader from "@/app/components/loaders/arrow_loader";
import { useRouter } from "next/navigation";

type Scores = {
  [`scores2`]?: number[];
  [`scores3`]?: number[];
  [`scores4`]?: number[];
  [`scores5`]?: number[];
  [`scores6`]?: number[];
  [`scores7`]?: number[];
};

type Averages = {
  [`average2`]?: number;
  [`average3`]?: number;
  [`average4`]?: number;
  [`average5`]?: number;
  [`average6`]?: number;
  [`average7`]?: number;
};

interface StatsManagerProps {
  scores: Scores;
  averages: Averages;
}

export default function StatsManager({ scores, averages }: StatsManagerProps) {
  const router = useRouter();
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const confirmDeleteMessage = useRef("");

  const selectAllRef = useRef<HTMLInputElement | null>(null);
  const checkboxRefs = useRef<(HTMLInputElement | null)[]>([]);
  const lastCheckboxChecked = useRef(0);

  useEffect(() => {
    if (showDeleteMenu) {
      window.addEventListener("keydown", handleKeydown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [showDeleteMenu, showDeleteButton]);

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      closeDeleteMenu();
    } else if (e.key === "Backspace") {
      if (showDeleteButton) {
        confirmDeletion();
      }
    }
  }

  function openDeleteMenu() {
    lastCheckboxChecked.current = 0;
    setShowDeleteMenu(true);
  }

  function closeDeleteMenu() {
    setShowDeleteMenu(false);
    setShowDeleteButton(false);
  }

  const [statsEntries, setStatEntries] = useState<StatsEntryProps[]>(
    [2, 3, 4, 5, 6, 7]
      .filter((n) => {
        const scoresKey = `scores${n}` as keyof Scores;
        return scores[scoresKey] && scores[scoresKey].length > 0;
      })
      .map((n) => {
        const scoresKey = `scores${n}` as keyof Scores;
        const averagesKey = `average${n}` as keyof Averages;
        return {
          scores: scores[scoresKey] || [],
          globalAverage: averages[averagesKey] ? averages[averagesKey] : 0,
          digits: n,
        };
      })
  );

  //Allows shift click selecting of checkboxes
  function handleCheckboxClick(e: React.MouseEvent, index: number) {
    checkboxRefs.current.some((checkbox) => {
      return checkbox?.checked === true;
    })
      ? setShowDeleteButton(true)
      : setShowDeleteButton(false);
    if (e.shiftKey && checkboxRefs.current[index]?.checked) {
      for (
        let i = Math.min(index, lastCheckboxChecked.current);
        i < Math.max(index, lastCheckboxChecked.current);
        i++
      ) {
        const checkbox = checkboxRefs.current[i];
        if (checkbox) {
          checkbox.checked = true;
        }
      }
    }
    if (checkboxRefs.current[index]?.checked) {
      lastCheckboxChecked.current = index;
    } else {
      if (selectAllRef.current) {
        selectAllRef.current.checked = false;
      }
    }
  }

  //Does identical things as handleCheckboxClick for keydown
  function handleCheckboxKeydown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (e.key === "Enter" || e.key === "Space") {
      const checkbox = checkboxRefs.current[index];
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      if (e.shiftKey && checkboxRefs.current[index]?.checked) {
        for (
          let i = Math.min(index, lastCheckboxChecked.current);
          i < Math.max(index, lastCheckboxChecked.current);
          i++
        ) {
          const checkbox = checkboxRefs.current[i];
          if (checkbox) {
            checkbox.checked = true;
          }
        }
      }
      if (checkboxRefs.current[index]?.checked) {
        lastCheckboxChecked.current = index;
      } else {
        if (selectAllRef.current) {
          selectAllRef.current.checked = false;
        }
      }
      checkboxRefs.current.some((checkbox) => {
        return checkbox?.checked === true;
      })
        ? setShowDeleteButton(true)
        : setShowDeleteButton(false);
    }
  }

  //Deletes all entries selected
  async function deleteEntries() {
    setShowConfirmDelete(false);
    setShowLoading(true);
    const indexesToBeDeleted = checkboxRefs.current
      .map((checkbox, index) => (checkbox?.checked === true ? index : -1))
      .filter((index) => index !== -1);
    const digitsToBeDeleted = checkboxRefs.current
      .map((checkbox) => (checkbox?.checked === true ? checkbox.id : -1))
      .filter((digits) => digits !== -1);
    const options = {
      method: "DELETE",
      body: JSON.stringify({ digits: digitsToBeDeleted }),
      headers: { "Content-Type": "application/json" },
    };
    const res = await fetch("/api/stats/deleteStats", options);
    const data = await res.json();
    if (data.success) {
      const newStatEntries: StatsEntryProps[] = [];
      statsEntries.map((entry, index) => {
        indexesToBeDeleted[0] === index
          ? indexesToBeDeleted.shift()
          : newStatEntries.push(entry);
      });
      setStatEntries(newStatEntries);
    } else {
      if (data.logout) {
        router.push("/login");
      }
    }
    setShowLoading(false);
    setShowDeleteButton(false);
    setShowDeleteMenu(false);
  }

  // Opens the dialog box to confirm deleting the entries
  function confirmDeletion() {
    const toBeDeleted = checkboxRefs.current
      .map((checkbox) => (checkbox?.checked === true ? checkbox.id : -1))
      .filter((digits) => digits !== -1);
    if (toBeDeleted.length === checkboxRefs.current.length) {
      confirmDeleteMessage.current = `Delete all stats?`;
      setShowConfirmDelete(true);
      return;
    }
    let message = `Delete stats for ${toBeDeleted[0]}`;
    if (toBeDeleted.length === 2) {
      message += ` and ${toBeDeleted[1]}`;
    } else {
      for (let i = 1; i < toBeDeleted.length; i++) {
        i === toBeDeleted.length - 1
          ? (message += ` and ${toBeDeleted[i]}`)
          : (message += `, ${toBeDeleted[i]}`);
      }
    }
    message += ` digits?`;
    confirmDeleteMessage.current = message;
    setShowConfirmDelete(true);
  }

  function handleSelectAll() {
    if (selectAllRef.current && selectAllRef.current.checked) {
      checkboxRefs.current.forEach((checkbox) => {
        if (checkbox) {
          checkbox.checked = true;
        }
      });
      setShowDeleteButton(true);
    } else {
      checkboxRefs.current.forEach((checkbox) => {
        if (checkbox) {
          checkbox.checked = false;
        }
      });
      setShowDeleteButton(false);
    }
  }

  function handleSelectAllKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (selectAllRef.current) {
        selectAllRef.current.checked = !selectAllRef.current.checked;
        handleSelectAll();
      }
    }
  }

  return statsEntries.length > 0 ? (
    <div className={styles.stats}>
      <div className={classNames(styles.pillar_decoration, styles.left)}></div>
      <div className={classNames(styles.pillar_decoration, styles.right)}></div>
      <div className={classNames(styles.circle_decoration, styles.left)}></div>
      <div className={classNames(styles.circle_decoration, styles.right)}></div>
      {showConfirmDelete && (
        <Modal closeFunction={() => setShowConfirmDelete(false)} animate={true}>
          <div
            className={styles.delete_confirmation_container}
            aria-label="Delete Confirmation Container"
          >
            <div className={styles.message}>{confirmDeleteMessage.current}</div>
            <div className={styles.buttons_wrapper}>
              <Button
                variant="tertiary"
                onClick={() => setShowConfirmDelete(false)}
              >{`Cancel`}</Button>
              <Button variant="red" onClick={deleteEntries}>{`Delete`}</Button>
            </div>
          </div>
        </Modal>
      )}
      {showLoading && (
        <Modal unstyled={true} closeOnEscape={false} closeFunction={() => {}}>
          <div
            tabIndex={0}
            aria-label="Deleting your stats. Please wait..."
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
      <div className={styles.content_wrapper}>
        <div className={styles.stats_header}>
          <h1>{`Your Stats`}</h1>
          <div className={styles.controls}>
            {showDeleteMenu && (
              <div className={styles.delete_menu}>
                {showDeleteButton && (
                  <Button
                    variant="red"
                    title="Delete selected stats"
                    onClick={confirmDeletion}
                  >{`Delete`}</Button>
                )}
                <Button
                  variant="tertiary"
                  title="Close Delete Menu"
                  onClick={closeDeleteMenu}
                >{`Cancel`}</Button>
              </div>
            )}
            {!showDeleteMenu && (
              <div className={styles.trash_btn_wrapper}>
                <Button
                  variant="tertiary"
                  onClick={openDeleteMenu}
                  title="Open Delete Menu"
                  width="smallest"
                >
                  <TrashIcon />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.entries_wrapper}>
          {showDeleteMenu && (
            <div className={styles.select_all_wrapper}>
              <input
                type={"checkbox"}
                className={styles.checkbox}
                onClick={handleSelectAll}
                onKeyDown={handleSelectAllKeydown}
                ref={selectAllRef}
                aria-label="Select all stat entries"
                aria-selected={
                  (selectAllRef.current && selectAllRef.current.checked) ||
                  false
                }
              />
              <div>{`Select All`}</div>
            </div>
          )}
          {statsEntries.map((entry, index) => {
            return (
              <div className={styles.entry_row} key={`row-${index}`}>
                {showDeleteMenu && (
                  <div className={styles.checkbox_wrapper}>
                    <input
                      type={"checkbox"}
                      className={styles.checkbox}
                      ref={(el) => {
                        checkboxRefs.current[index] = el;
                      }}
                      onClick={(e) => handleCheckboxClick(e, index)}
                      onKeyDown={(e) => handleCheckboxKeydown(e, index)}
                      id={`${entry.digits}`}
                      aria-selected={
                        (checkboxRefs.current[index] &&
                          checkboxRefs.current[index].checked) ||
                        false
                      }
                      aria-label={
                        checkboxRefs.current[index] &&
                        checkboxRefs.current[index].checked
                          ? `Deselect stat entry`
                          : `Select stat entry`
                      }
                    />
                  </div>
                )}
                <StatsEntry
                  scores={entry.scores}
                  globalAverage={entry.globalAverage}
                  digits={entry.digits}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.stats}>
      <div
        className={styles.empty_stats_message}
      >{`Play some games to see your stats!`}</div>
    </div>
  );
}
