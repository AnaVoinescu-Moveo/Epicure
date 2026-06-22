'use client';
import { COPY } from '@/constants/copy';
import styles from './ChefsFilterNav.module.css';

export type ChefFilter = 'all' | 'new' | 'most-viewed';

const FILTERS: { key: ChefFilter; label: string }[] = [
  { key: 'all', label: COPY.chefs.filterAll },
  { key: 'new', label: COPY.chefs.filterNew },
  { key: 'most-viewed', label: COPY.chefs.filterMostViewed },
];

interface ChefsFilterNavProps {
  active: ChefFilter;
  onFilterChange: (filter: ChefFilter) => void;
}

export function ChefsFilterNav({
  active,
  onFilterChange,
}: ChefsFilterNavProps) {
  return (
    <nav className={styles.nav} aria-label={COPY.chefs.filterAriaLabel}>
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          className={`${styles.filterBtn} ${active === key ? styles.active : ''}`}
          onClick={() => onFilterChange(key)}
          aria-pressed={active === key}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
