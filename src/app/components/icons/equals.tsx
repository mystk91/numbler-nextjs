import * as React from "react";
interface EqualsProps {
  className?: string;
  style?: React.CSSProperties;
}

const Equals = ({ className, style }: EqualsProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 36"
    className={className}
    style={{ ...style }}
  >
    <rect width={48} height={12} x={0} y={0} rx={8} ry={8} />
    <rect width={48} height={12} x={0} y={24} rx={8} ry={8} />
  </svg>
);
export default Equals;
