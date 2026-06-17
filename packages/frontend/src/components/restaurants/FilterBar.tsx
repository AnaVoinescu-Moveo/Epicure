'use client';

import Image from 'next/image';
import { useState } from 'react';
import { COPY } from '@/constants/copy';
import styles from './FilterBar.module.css';

type FilterBarId = 'price-range' | 'distance' | 'rating';

interface FilterBarItem {
  id: FilterBarId;
  label: string;
}

const FILTER_ITEMS: FilterBarItem[] = [
  { id: 'price-range', label: COPY.restaurants.filterBarPriceRange },
  { id: 'distance', label: COPY.restaurants.filterBarDistance },
  { id: 'rating', label: COPY.restaurants.filterBarRating },
];

export function FilterBar() {
  const [selected, setSelected] = useState<Set<FilterBarId>>(new Set());

  const toggle = (id: FilterBarId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.bar}>
      <div className={styles.filters}>
        {FILTER_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.filterItem}${selected.has(id) ? ` ${styles.filterItemSelected}` : ''}`}
            onClick={() => toggle(id)}
          >
            <span className={styles.label}>{label}</span>
            <Image
              src="/icons/downArrow.svg"
              alt=""
              width={24}
              height={24}
              className={styles.arrow}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
