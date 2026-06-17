'use client';

import { COPY } from '@/constants/copy';
import styles from './FilterNav.module.css';

export type FilterId = 'all' | 'new' | 'most-popular' | 'open-now' | 'map-view';

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

interface FilterNavProps {
  activeFilter: FilterId;
  onFilterChange: (id: FilterId) => void;
}

export function FilterNav({ activeFilter, onFilterChange }: FilterNavProps) {
  return (
    <nav className={styles.nav}>
      {FILTERS.map(({ id, label, desktopOnly }) => (
        <button
          key={id}
          className={[
            styles.filter,
            activeFilter === id ? styles.filterActive : '',
            desktopOnly ? styles.desktopOnly : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => onFilterChange(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
