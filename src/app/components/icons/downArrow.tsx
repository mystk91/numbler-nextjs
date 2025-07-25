import * as React from "react";
interface DownArrowProps {
  className?: string;
  style?: React.CSSProperties;
}

const DownArrow = ({ className, style }: DownArrowProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="119.02 80.1 273.95 351.9"
    className={className}
    style={{ ...style }}
  >
    <path d="M383.6 322.7 278.6 423c-5.8 6-13.7 9-22.4 9s-16.5-3-22.4-9L128.4 322.7c-12.5-11.9-12.5-31.3 0-43.2 12.5-11.9 32.7-11.9 45.2 0l50.4 48.2v-217c0-16.9 14.3-30.6 32-30.6s32 13.7 32 30.6v217l50.4-48.2c12.5-11.9 32.7-11.9 45.2 0s12.5 31.2 0 43.2z" />
  </svg>
);
export default DownArrow;
