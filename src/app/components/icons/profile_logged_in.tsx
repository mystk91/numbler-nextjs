import * as React from "react";
interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

const ProfileLoggedIn = ({ className, style }: SvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    style={{
      fill: "var(--grey-text)",
      stroke: "var(--grey-text)",
      ...style,
    }}
    className={className}
  >
    <circle
      cx={16}
      cy={16}
      r={15}
      fill="none"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={0.8}
      style={{ ...style }}
      className={className}
    />
    <path
      fill="none"
      strokeWidth={0.5}
      d="M9 29a5 8.5 0 0 1 14 0"
    />
    <circle
      cx={16}
      cy={11.5}
      r={5.5}
      fill="none"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={0.5}
    />
    <circle cx={27} cy={5} r={5} fill="var(--green)" stroke="var(--green)" />
  </svg>
);
export default ProfileLoggedIn;
