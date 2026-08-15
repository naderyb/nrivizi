"use client";

import {
  HTMLAttributes,
  ReactNode,
  useRef,
  useState,
  MouseEvent,
  CSSProperties,
} from "react";
import styles from "./glassCard.module.css";

type Accent = "info" | "finance" | "marketing" | "extra" | undefined;

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accent?: Accent;
  strong?: boolean;
  interactive?: boolean;
}

const REST_VARS: CSSProperties = {
  ["--mx" as string]: "24%",
  ["--my" as string]: "-6%",
  transform: "perspective(900px) rotateX(0deg) rotateY(0deg)",
};

export default function GlassCard({
  children,
  accent,
  strong = false,
  interactive = false,
  className = "",
  style,
  ...rest
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pointerVars, setPointerVars] = useState<CSSProperties>(REST_VARS);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    // Subtle tilt — a real glass pane responding to where light hits it,
    // not a cartoonish flip. Kept small on purpose.
    const rx = ((y - 50) / 50) * -3;
    const ry = ((x - 50) / 50) * 3;
    setPointerVars({
      ["--mx" as string]: `${x}%`,
      ["--my" as string]: `${y}%`,
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`,
    });
  }

  function handleMouseLeave() {
    setPointerVars(REST_VARS);
  }

  const classes = [
    styles.card,
    accent ? styles[accent] : "",
    strong ? styles.strong : "",
    interactive ? styles.interactive : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={classes}
      style={{ ...pointerVars, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </div>
  );
}
