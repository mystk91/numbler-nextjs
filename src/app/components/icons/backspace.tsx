import * as React from "react";
interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}
const Backspace = ({ className, style }: SvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28 28"
    style={{
      ...style,
    }}
    className={className}
  >
    <path d="M14.078 11.975a.71.71 0 0 1 0-1.012l.256-.253a.73.73 0 0 1 1.024 0l2.047 2.025 2.048-2.025a.73.73 0 0 1 1.023 0l.256.253a.71.71 0 0 1 0 1.013L18.685 14l2.047 2.024a.71.71 0 0 1 0 1.013l-.256.253a.73.73 0 0 1-1.023 0l-2.048-2.025-2.047 2.025a.73.73 0 0 1-1.024 0l-.256-.253a.71.71 0 0 1 0-1.012L16.126 14l-2.048-2.025Z" />
    <path
      fillRule="evenodd"
      d="M8.061 5.5a2 2 0 0 0-1.541.725l-5.06 6.118a2 2 0 0 0-.066 2.464l5.093 6.883a2 2 0 0 0 1.607.81H25a2 2 0 0 0 2-2v-13a2 2 0 0 0-2-2H8.061Zm0 2H25v13H8.094l-5.092-6.882L8.061 7.5Z"
      clipRule="evenodd"
    />
  </svg>
);
export default Backspace;
