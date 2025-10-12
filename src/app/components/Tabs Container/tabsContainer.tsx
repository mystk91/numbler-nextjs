"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import classNames from "classnames";
import styles from "./tabsContainer.module.css";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Creates a panel which will be displayed when we click a tab
function TabPanel({ children, index, value }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <div className={styles.tab_panel}>{children}</div>}
    </div>
  );
}

export interface TabItem {
  label: string;
  content: React.ReactNode;
  style?: React.CSSProperties; // We can use this to make tabs different sizes, like flex: 2 and flex: 1
}

interface TabContainerProps {
  tabs: TabItem[];
  defaultTab?: number;
}

export default function TabContainer({
  tabs,
  defaultTab = 0,
}: TabContainerProps) {
  const [initialized, setInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Creates a ref array to hold the button elements for each tab
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [currentTab, setCurrentTab] = useState(defaultTab);
  // We need this also to make resize observer work correctly
  const currentTabRef = useRef(currentTab);
  const [indicatorStyle, setIndicatorStyle] = useState({
    height: Number(tabRefs.current[currentTab]?.clientHeight) - 12,
    width: tabRefs.current[currentTab]?.clientWidth,
    left: tabRefs.current[currentTab]?.offsetLeft,
    transition: "",
  });

  function updateIndicator(tabIndex = currentTab, transition = true) {
    const tabElement = tabRefs.current[tabIndex];
    if (tabElement) {
      const rect = tabElement.getBoundingClientRect();
      const parent = tabElement.parentElement;
      const parentRect = parent?.getBoundingClientRect();
      setIndicatorStyle({
        height: rect.height - 12,
        width: rect.width + 12,
        left: rect.left - parentRect!.left + parent!.scrollLeft - 6,
        transition: transition ? "" : "none",
      });
    }
  }

  // Moves the indicator
  useEffect(() => {
    currentTabRef.current = currentTab;
    updateIndicator();
  }, [currentTab]);

  // Adds a resize observer so the indicator will move correctly
  useEffect(() => {
    setInitialized(true);
    if (!containerRef?.current) return;
    const observer = new ResizeObserver(() => {
      updateIndicator(currentTabRef.current, false);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      style={{ opacity: initialized ? "1" : "0" }}
    >
      <div className={styles.tabs_wrapper}>
        <div className={styles.tabs} role="tablist">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={classNames(styles.tab, {
                [styles.active]: currentTab === index,
              })}
              onClick={() => setCurrentTab(index)}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              aria-controls={`tabpanel-${index}`}
              aria-selected={currentTab === index}
              style={tab.style}
            >
              <div className={styles.tab_label}>{tab.label}</div>
            </button>
          ))}
          <div className={styles.indicator} style={indicatorStyle}></div>
        </div>
      </div>
      <div className={styles.tab_panels}>
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={currentTab} index={index}>
            {tab.content}
          </TabPanel>
        ))}
      </div>
    </div>
  );
}
