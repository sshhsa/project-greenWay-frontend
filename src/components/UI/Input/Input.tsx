"use client";

import { useEffect, useRef } from "react";
import styles from "./Input.module.css";

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  state?: "default" | "focus" | "error";
}

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  autoFocus = false,
  state = "default",
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <input
      ref={inputRef}
      className={`${styles.input} ${
        value ? styles.filled : styles.placeholder
      } ${styles[`${state}Border`]}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      readOnly={!onChange}
      autoFocus={autoFocus}
    />
  );
}
