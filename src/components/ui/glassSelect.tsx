import { SelectHTMLAttributes, forwardRef } from "react";
import styles from "./glassInput.module.css";

interface Option {
  value: string;
  label: string;
}

interface GlassSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(
  (
    { label, error, id, options, placeholder, className = "", ...rest },
    ref,
  ) => {
    return (
      <div className={styles.wrapper}>
        {label && (
          <label className={styles.label} htmlFor={id}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={[styles.input, error ? styles.error : "", className]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={!!error}
          defaultValue=""
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  },
);

GlassSelect.displayName = "GlassSelect";
export default GlassSelect;
