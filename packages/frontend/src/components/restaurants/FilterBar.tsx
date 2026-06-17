'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { COPY } from '@/constants/copy';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { PriceRangeDropdown } from './PriceRangeDropdown';
import { DistanceDropdown } from './DistanceDropdown';
import { RatingDropdown } from './RatingDropdown';
import styles from './FilterBar.module.css';

type FilterBarId = 'price-range' | 'distance' | 'rating';

export interface PriceBounds {
  min: number;
  max: number;
}

export interface FilterBarProps {
  priceBounds: PriceBounds;
  priceRange: PriceBounds | null;
  onPriceRangeChange: (range: PriceBounds | null) => void;
  distanceKm: number | null;
  locationLoading: boolean;
  onDistanceChange: (km: number) => void;
  onRequestLocation: () => void;
  selectedRatings: number[];
  onRatingsChange: (ratings: number[]) => void;
}

export function FilterBar({
  priceBounds,
  priceRange,
  onPriceRangeChange,
  distanceKm,
  locationLoading,
  onDistanceChange,
  onRequestLocation,
  selectedRatings,
  onRatingsChange,
}: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<FilterBarId | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpenDropdown(null), []);
  useClickOutside(barRef, close);
  useEscapeKey(close, openDropdown !== null);

  const toggle = (id: FilterBarId) => {
    if (id === 'distance' && openDropdown !== 'distance') {
      onRequestLocation();
    }
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const isPriceActive =
    priceRange !== null &&
    (priceRange.min !== priceBounds.min || priceRange.max !== priceBounds.max);

  return (
    <div className={styles.bar} ref={barRef}>
      <div className={styles.filters}>
        <div className={styles.filterItem}>
          <button
            className={`${styles.button}${isPriceActive || openDropdown === 'price-range' ? ` ${styles.buttonSelected}` : ''}`}
            onClick={() => toggle('price-range')}
          >
            <span className={styles.label}>
              {COPY.restaurants.filterBarPriceRange}
            </span>
            <Image
              src="/icons/downArrow.svg"
              alt=""
              width={24}
              height={24}
              className={styles.arrow}
            />
          </button>
          {openDropdown === 'price-range' && (
            <div className={styles.dropdownWrapper}>
              <PriceRangeDropdown
                value={priceRange ?? priceBounds}
                bounds={priceBounds}
                onChange={onPriceRangeChange}
              />
            </div>
          )}
        </div>

        <div className={styles.filterItem}>
          <button
            className={`${styles.button}${distanceKm !== null || openDropdown === 'distance' ? ` ${styles.buttonSelected}` : ''}`}
            onClick={() => toggle('distance')}
          >
            <span className={styles.label}>
              {COPY.restaurants.filterBarDistance}
            </span>
            <Image
              src="/icons/downArrow.svg"
              alt=""
              width={24}
              height={24}
              className={styles.arrow}
            />
          </button>
          {openDropdown === 'distance' && (
            <div className={styles.dropdownWrapper}>
              <DistanceDropdown
                value={distanceKm}
                locationLoading={locationLoading}
                onChange={onDistanceChange}
              />
            </div>
          )}
        </div>

        <div className={styles.filterItem}>
          <button
            className={`${styles.button}${selectedRatings.length > 0 || openDropdown === 'rating' ? ` ${styles.buttonSelected}` : ''}`}
            onClick={() => toggle('rating')}
          >
            <span className={styles.label}>
              {COPY.restaurants.filterBarRating}
            </span>
            <Image
              src="/icons/downArrow.svg"
              alt=""
              width={24}
              height={24}
              className={styles.arrow}
            />
          </button>
          {openDropdown === 'rating' && (
            <div className={styles.dropdownWrapper}>
              <RatingDropdown
                selected={selectedRatings}
                onChange={onRatingsChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
