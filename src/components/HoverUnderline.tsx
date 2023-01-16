import { useState } from "react";

export function HoverUnderline({ children }: { children: React.ReactNode }) {
  const [hover, setHover] = useState(false);

  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textDecoration: hover ? "underline" : "none",
      }}
    >
      {children}
    </span>
  );
}
