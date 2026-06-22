'use client';

import { useEffect, useRef, useState } from 'react';
import { COPY } from '@/constants/copy';
import { geocodeAddress, isInTelAviv } from '@/lib/geocoding';
import type { UserCoords } from '@/lib/distance';
import styles from './DistanceDropdown.module.css';

const MAX_KM = 5;
const CONTAINER_W = 309;
const THUMB_W = 16;
const LABEL_HALF_W = 16;

type AddressStatus = 'idle' | 'loading' | 'error';

interface DistanceDropdownProps {
  value: number | null;
  locationLoading: boolean;
  locationGranted: boolean;
  locationDenied: boolean;
  onChange: (km: number) => void;
  onRequestLocation: () => void;
  onSkipToAddress: () => void;
  onCoordsFromAddress: (coords: UserCoords) => void;
}

export function DistanceDropdown({
  value,
  locationLoading,
  locationGranted,
  locationDenied,
  onChange,
  onRequestLocation,
  onSkipToAddress,
  onCoordsFromAddress,
}: DistanceDropdownProps) {
  const [displayValue, setDisplayValue] = useState(value ?? MAX_KM);
  const [addressStatus, setAddressStatus] = useState<AddressStatus>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);

  // Emit the initial distance so the filter is active as soon as location is granted
  useEffect(() => {
    if (locationGranted && value === null) {
      onChange(MAX_KM);
    }
  }, [locationGranted, value, onChange]);

  const labelLeft = (v: number) => {
    const center = THUMB_W / 2 + (v / MAX_KM) * (CONTAINER_W - THUMB_W);
    return Math.max(
      0,
      Math.min(CONTAINER_W - LABEL_HALF_W * 2, center - LABEL_HALF_W),
    );
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setDisplayValue(v);
    onChange(v);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    const address = inputRef.current?.value.trim();
    if (!address) return;
    submittingRef.current = true;
    setAddressStatus('loading');
    const result = await geocodeAddress(address);
    submittingRef.current = false;
    if (result && isInTelAviv(result.lat, result.lon)) {
      onCoordsFromAddress({ latitude: result.lat, longitude: result.lon });
      setAddressStatus('idle');
    } else {
      setAddressStatus('error');
    }
  };

  const isAddressLoading = addressStatus === 'loading';

  if (locationLoading || isAddressLoading) {
    return (
      <div className={styles.dropdown}>
        <p className={styles.title}>
          {COPY.restaurants.filterBarDistanceTitle}
        </p>
        <p className={styles.gpsLoading}>
          {isAddressLoading
            ? COPY.restaurants.filterBarAddressSearching
            : COPY.restaurants.filterBarLocating}
        </p>
      </div>
    );
  }

  if (locationGranted) {
    return (
      <div className={styles.dropdown}>
        <p className={styles.title}>
          {COPY.restaurants.filterBarDistanceTitle}
        </p>
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
            onChange={handleSliderChange}
            aria-label={COPY.restaurants.filterBarDistanceAriaLabel}
          />
        </div>
      </div>
    );
  }

  if (locationDenied) {
    return (
      <div className={styles.dropdown}>
        <p className={styles.title}>
          {COPY.restaurants.filterBarDistanceTitle}
        </p>
        <form className={styles.addressForm} onSubmit={handleAddressSubmit}>
          <input
            ref={inputRef}
            className={styles.addressInput}
            type="text"
            placeholder={COPY.restaurants.filterBarAddressPlaceholder}
            autoFocus
          />
          <button className={styles.addressSubmit} type="submit">
            {COPY.restaurants.filterBarAddressSubmit}
          </button>
          {addressStatus === 'error' && (
            <p className={styles.addressError}>
              {COPY.restaurants.filterBarAddressError}
            </p>
          )}
        </form>
        <button className={styles.tryGpsButton} onClick={onRequestLocation}>
          {COPY.restaurants.filterBarTryGps}
        </button>
      </div>
    );
  }

  // idle — ask the user what they want to do
  return (
    <div className={styles.dropdown}>
      <p className={styles.title}>{COPY.restaurants.filterBarDistanceTitle}</p>
      <div className={styles.idleActions}>
        <button className={styles.locateButton} onClick={onRequestLocation}>
          {COPY.restaurants.filterBarMyLocation}
        </button>
        <button className={styles.skipButton} onClick={onSkipToAddress}>
          {COPY.restaurants.filterBarEnterAddress}
        </button>
      </div>
    </div>
  );
}
