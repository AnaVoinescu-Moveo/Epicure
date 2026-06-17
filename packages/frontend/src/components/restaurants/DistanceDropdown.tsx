'use client';

import { useState } from 'react';
import { COPY } from '@/constants/copy';
import styles from './DistanceDropdown.module.css';

const MAX_KM = 5;
const CONTAINER_W = 309;
const THUMB_W = 16;
const LABEL_HALF_W = 16; // half-width for "5 km" at bold 12px

interface DistanceDropdownProps {
  value: number | null;
  locationLoading: boolean;
  onChange: (km: number) => void;
}

export function DistanceDropdown({
  value,
  locationLoading,
  onChange,
}: DistanceDropdownProps) {
  const [displayValue, setDisplayValue] = useState(value ?? MAX_KM);

  const thumbPx = (v: number) =>
    THUMB_W / 2 + (v / MAX_KM) * (CONTAINER_W - THUMB_W);

  // Clamped label left so it never overflows container edges
  const labelLeft = (v: number) => {
    const center = thumbPx(v);
    return Math.max(
      0,
      Math.min(CONTAINER_W - LABEL_HALF_W * 2, center - LABEL_HALF_W),
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setDisplayValue(v);
    onChange(v);
  };

  return (
    <div className={styles.dropdown}>
      <p className={styles.title}>{COPY.restaurants.filterBarDistanceTitle}</p>
      {locationLoading ? (
        <p className={styles.gpsLoading}>Locating…</p>
      ) : (
        <div className={styles.sliderContainer}>
          <span className={styles.myLocationLabel} aria-hidden="true">
            {COPY.restaurants.filterBarMyLocation}
          </span>
          <span
            className={styles.handleLabel}
            style={{ left: labelLeft(displayValue) }}
            aria-hidden="true"
          >
            {COPY.restaurants.filterBarDistanceValue(displayValue)}
          </span>
          <div className={styles.trackBase} />
          <div className={styles.myLocationThumb} />
          <input
            type="range"
            className={styles.rangeInput}
            min={0}
            max={MAX_KM}
            step={0.5}
            value={displayValue}
            onChange={handleChange}
            aria-label="Maximum distance in km"
          />
        </div>
      )}
    </div>
  );
}
