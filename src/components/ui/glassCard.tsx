import { HTMLAttributes, ReactNode } from "react";
import styles from "./glassCard.module.css";

type Accent = "info" | "finance" | "marketing" | "extra" | undefined;

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accent?: Accent;
  strong?: boolean;
  interactive?: boolean;
}

export default function GlassCard({
  children,
  accent,
  strong = false,
  interactive = false,
  className = "",
  ...rest
}: GlassCardProps) {
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
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
