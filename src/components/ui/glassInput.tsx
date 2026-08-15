import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./glassInput.module.css";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, id, className = "", ...rest }, ref) => {
    return (
      <div className={styles.wrapper}>
        {label && (
          <label className={styles.label} htmlFor={id}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={[styles.input, error ? styles.error : "", className]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={!!error}
          {...rest}
        />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  },
);

GlassInput.displayName = "GlassInput";
export default GlassInput;
