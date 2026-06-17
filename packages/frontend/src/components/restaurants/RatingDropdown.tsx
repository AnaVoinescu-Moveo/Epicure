'use client';

import { COPY } from '@/constants/copy';
import { RatingStars } from '@/components/ui/RatingStars';
import styles from './RatingDropdown.module.css';

interface RatingDropdownProps {
  selected: number[];
  onChange: (ratings: number[]) => void;
}

const RATINGS = [1, 2, 3, 4, 5];

export function RatingDropdown({ selected, onChange }: RatingDropdownProps) {
  const toggle = (rating: number) => {
    onChange(
      selected.includes(rating)
        ? selected.filter((r) => r !== rating)
        : [...selected, rating],
    );
  };

  return (
    <div className={styles.dropdown}>
      <p className={styles.title}>{COPY.restaurants.filterBarRatingTitle}</p>
      <ul className={styles.list}>
        {RATINGS.map((rating) => {
          const checked = selected.includes(rating);
          return (
            <li key={rating}>
              <button
                className={styles.row}
                onClick={() => toggle(rating)}
                aria-pressed={checked}
                aria-label={COPY.ui.starsAriaLabel(rating)}
              >
                <span
                  className={`${styles.checkbox}${checked ? ` ${styles.checkboxChecked}` : ''}`}
                  aria-hidden="true"
                />
                <RatingStars rating={rating} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
