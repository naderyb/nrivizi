import { ReactNode } from "react";
import styles from "./badge.module.css";

type Variant = "neutral" | "info" | "finance" | "marketing";

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
}

export default function Badge({ children, variant = "neutral" }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[variant]].join(" ")}>
      {children}
    </span>
  );
}
