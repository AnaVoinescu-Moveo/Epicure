'use client';

import { COPY } from '@/constants/copy';
import styles from './PriceRangeDropdown.module.css';

interface PriceRangeDropdownProps {
  value: { min: number; max: number };
  bounds: { min: number; max: number };
  onChange: (range: { min: number; max: number } | null) => void;
}

const CONTAINER_W = 309;
const THUMB_W = 16;
const LABEL_HALF_W = 22; // conservative half-width for bold price labels

export function PriceRangeDropdown({
  value,
  bounds,
  onChange,
}: PriceRangeDropdownProps) {
  const { min, max } = value;
  const { min: lo, max: hi } = bounds;
  const span = hi - lo || 1;

  // Center px of thumb, then clamped so label never overflows container edges
  const labelLeft = (v: number) => {
    const center = THUMB_W / 2 + ((v - lo) / span) * (CONTAINER_W - THUMB_W);
    return Math.max(
      0,
      Math.min(CONTAINER_W - LABEL_HALF_W * 2, center - LABEL_HALF_W),
    );
  };

  const emit = (newMin: number, newMax: number) => {
    onChange(
      newMin === lo && newMax === hi ? null : { min: newMin, max: newMax },
    );
  };

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    emit(Math.min(Number(e.target.value), max - 1), max);
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    emit(min, Math.max(Number(e.target.value), min + 1));
  };

  return (
    <div className={styles.dropdown}>
      <p className={styles.title}>{COPY.restaurants.filterBarPriceTitle}</p>
      <p className={styles.rangeValue}>
        {COPY.restaurants.filterBarPriceValue(min, max)}
      </p>
      <div className={styles.sliderContainer}>
        <span
          className={styles.handleLabel}
          style={{ left: labelLeft(min) }}
          aria-hidden="true"
        >
          ₪{min}
        </span>
        <span
          className={styles.handleLabel}
          style={{ left: labelLeft(max) }}
          aria-hidden="true"
        >
          ₪{max}
        </span>
        <div className={styles.trackBase} />
        <input
          type="range"
          className={styles.rangeInput}
          min={lo}
          max={hi}
          value={min}
          onChange={handleMin}
          aria-label="Minimum price"
        />
        <input
          type="range"
          className={styles.rangeInput}
          min={lo}
          max={hi}
          value={max}
          onChange={handleMax}
          aria-label="Maximum price"
        />
      </div>
    </div>
  );
}
