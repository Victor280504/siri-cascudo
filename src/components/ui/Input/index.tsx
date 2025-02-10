import { forwardRef, InputHTMLAttributes, useId } from "react";
import styles from "./Input.module.css";
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  fileType?: string;
  editInput?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { type = "", name = "", label = "", helperText = "", editInput, ...props },
    ref
  ) => {
    const inputId = useId();
    const hasError = helperText.length > 0;
    return (
      <div className={styles.container}>
        <label
          className={`${styles.label} ${props.required && styles.required} ${
            editInput ? styles.editInput : ""
          }`}
          htmlFor={inputId}
        >
          {label}
        </label>
        <input
          id={inputId}
          className={`${styles.input} ${hasError ? styles.error : ""} ${
            editInput ? styles.editInput : ""
          }`}
          type={type}
          name={name}
          ref={ref}
          {...props}
        />
        {/* {editInput && (
          <span className="material-symbols-outlined edit sm" style={{ cursor: "pointer", position: "absolute", left: "90%", top: "50%" }}>
            edit
          </span>
        )} */}
        {hasError && <span className={styles.helper_text}>{helperText}</span>}
      </div>
    );
  }
);
