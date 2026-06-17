'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import type { Restaurant } from '@/lib/strapi';
import { isOpenNow } from '@/lib/time';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import { FilterBar } from './FilterBar';
import { FilterNav, type FilterId } from './FilterNav';
import styles from './RestaurantsList.module.css';

const RestaurantsMap = dynamic(
  () => import('./RestaurantsMap').then((m) => m.RestaurantsMap),
  { ssr: false, loading: () => <div className={styles.mapPlaceholder} /> },
);

interface RestaurantsListProps {
  restaurants: Restaurant[];
}

export function RestaurantsList({ restaurants }: RestaurantsListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handleChange = ({ matches }: MediaQueryListEvent) => {
      if (!matches && activeFilter === 'map-view') {
        setActiveFilter('all');
      }
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [activeFilter]);

  const filtered = useMemo(() => {
    switch (activeFilter) {
      case 'most-popular':
        return restaurants.slice(0, 3);
      case 'new':
        return restaurants.filter((r) => r.isNew);
      case 'open-now':
        return restaurants.filter((r) =>
          isOpenNow(r.openingTime, r.closingTime),
        );
      default:
        return restaurants;
    }
  }, [restaurants, activeFilter]);

  return (
    <>
      <div className={styles.filtersWrapper}>
        <FilterNav
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>
      <div className={styles.filterBarWrapper}>
        <FilterBar />
      </div>
      {activeFilter === 'map-view' ? (
        <RestaurantsMap restaurants={restaurants} />
      ) : (
        <div className={styles.list}>
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} page />
          ))}
        </div>
      )}
    </>
  );
}
