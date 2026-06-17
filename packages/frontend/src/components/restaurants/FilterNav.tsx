'use client';

import { useState } from 'react';
import { COPY } from '@/constants/copy';
import styles from './FilterNav.module.css';

type FilterId = 'all' | 'new' | 'most-popular' | 'open-now' | 'map-view';

interface FilterItem {
  id: FilterId;
  label: string;
  desktopOnly?: true;
}

const FILTERS: FilterItem[] = [
  { id: 'all', label: COPY.restaurants.filterAll },
  { id: 'new', label: COPY.restaurants.filterNew },
  { id: 'most-popular', label: COPY.restaurants.filterMostPopular },
  { id: 'open-now', label: COPY.restaurants.filterOpenNow },
  { id: 'map-view', label: COPY.restaurants.filterMapView, desktopOnly: true },
];

export function FilterNav() {
  const [active, setActive] = useState<FilterId>('all');

  return (
    <nav className={styles.nav}>
      {FILTERS.map(({ id, label, desktopOnly }) => (
        <button
          key={id}
          className={[
            styles.filter,
            active === id ? styles.filterActive : '',
            desktopOnly ? styles.desktopOnly : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setActive(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
