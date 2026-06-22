'use client';

import { COPY } from '@/constants/copy';
import styles from './MealTypeFilter.module.css';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

interface Props {
  active: MealType;
  onChange: (meal: MealType) => void;
}

const TABS: { id: MealType; label: string }[] = [
  { id: 'breakfast', label: COPY.restaurantDetail.breakfastTab },
  { id: 'lunch', label: COPY.restaurantDetail.lunchTab },
  { id: 'dinner', label: COPY.restaurantDetail.dinnerTab },
];

export function MealTypeFilter({ active, onChange }: Props) {
  return (
    <nav className={styles.nav}>
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`${styles.item} ${active === id ? styles.itemActive : ''}`}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
