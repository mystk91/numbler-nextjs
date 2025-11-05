import * as React from "react";
interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

const Mail = ({ className, style }: SvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 122.879 88.855"
    className={className}
    style={style}
  >
    <path d="M7.048 0h108.784a7.03 7.03 0 0 1 4.977 2.069 7.032 7.032 0 0 1 2.07 4.979v74.759a6.992 6.992 0 0 1-1.221 3.951 2.744 2.744 0 0 1-.662.994 2.766 2.766 0 0 1-.656.461 7.03 7.03 0 0 1-4.508 1.643H7.048a7.034 7.034 0 0 1-4.979-2.07A7.031 7.031 0 0 1 0 81.807V7.048c0-1.941.792-3.704 2.068-4.979A7.025 7.025 0 0 1 7.048 0zM5.406 78.842l38.124-38.22L5.406 9.538v69.304zm42.323-34.797L8.424 83.449h105.701L76.563 44.051 64.18 54.602a2.7 2.7 0 0 1-3.453.043l-12.998-10.6zm32.945-3.496 36.799 38.598V9.198L80.674 40.549zM8.867 5.406l53.521 43.639 51.223-43.639H8.867z" />
  </svg>
);
export default Mail;
