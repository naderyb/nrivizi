import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./glassButton.module.css";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

export default function GlassButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: GlassButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    size !== "md" ? styles[size] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
