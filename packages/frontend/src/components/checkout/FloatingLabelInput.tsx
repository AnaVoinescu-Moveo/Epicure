'use client';

import { useId, useState } from 'react';
import styles from './FloatingLabelInput.module.css';

interface FloatingLabelInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string | null;
}

export function FloatingLabelInput({
  label,
  type = 'text',
  value,
  onChange,
  className,
  error,
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();
  const isFloating = isFocused || value.length > 0;

  return (
    <div className={`${styles.field} ${className ?? ''}`}>
      <label
        htmlFor={id}
        className={isFloating ? styles.labelFloating : styles.label}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={styles.input}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
