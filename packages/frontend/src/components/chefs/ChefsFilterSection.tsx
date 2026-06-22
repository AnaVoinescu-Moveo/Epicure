'use client';
import { useState } from 'react';
import { type Chef } from '@/lib/strapi';
import { COPY } from '@/constants/copy';
import { ChefsFilterNav, type ChefFilter } from './ChefsFilterNav';
import { ChefCard } from './ChefCard';
import styles from './ChefsFilterSection.module.css';

interface ChefsFilterSectionProps {
  chefs: Chef[];
}

const EMPTY_MESSAGES: Record<ChefFilter, string> = {
  all: COPY.chefs.emptyAll,
  new: COPY.chefs.emptyNew,
  'most-viewed': COPY.chefs.emptyMostViewed,
};

function applyFilter(chefs: Chef[], filter: ChefFilter): Chef[] {
  if (filter === 'new') return chefs.filter((c) => c.isNew);
  if (filter === 'most-viewed') return chefs.filter((c) => c.isMostViewed);
  return chefs;
}

export function ChefsFilterSection({ chefs }: ChefsFilterSectionProps) {
  const [filter, setFilter] = useState<ChefFilter>('all');
  const filtered = applyFilter(chefs, filter);

  return (
    <div className={styles.section}>
      <ChefsFilterNav active={filter} onFilterChange={setFilter} />
      {filtered.length === 0 ? (
        <p className={styles.empty}>{EMPTY_MESSAGES[filter]}</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((chef) => (
            <ChefCard key={chef.documentId} chef={chef} />
          ))}
        </div>
      )}
    </div>
  );
}
