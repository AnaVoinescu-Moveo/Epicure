'use client';

import { useMemo } from 'react';
import { SearchInput } from '@/components/search/SearchInput';
import { buildSearchFn } from '@/lib/searchUtils';
import type { Chef, Restaurant } from '@/lib/strapi';
import styles from './Hero.module.css';

interface HeroSearchProps {
  restaurants: Restaurant[];
  chefs: Chef[];
}

export function HeroSearch({ restaurants, chefs }: HeroSearchProps) {
  const onSearch = useMemo(
    () => buildSearchFn(restaurants, chefs),
    [restaurants, chefs],
  );
  return (
    <SearchInput
      iconPosition="left"
      autoFocus={false}
      className={styles.searchInput}
      onSearch={onSearch}
    />
  );
}
