'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Restaurant } from '@/lib/strapi';
import { isOpenNow } from '@/lib/time';
import { haversineKm, getUserLocation, type UserCoords } from '@/lib/distance';
import { COPY } from '@/constants/copy';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import { useRestaurantsFilter } from '@/context/RestaurantsFilterContext';
import { FilterBar, type PriceBounds } from './FilterBar';
import { FilterNav, type FilterId } from './FilterNav';
import styles from './RestaurantsList.module.css';

const RestaurantsMap = dynamic(
  () => import('./RestaurantsMap').then((m) => m.RestaurantsMap),
  { ssr: false, loading: () => <div className={styles.mapPlaceholder} /> },
);

type LocationStatus = 'idle' | 'loading' | 'granted' | 'denied';

interface RestaurantsListProps {
  restaurants: Restaurant[];
}

export function RestaurantsList({ restaurants }: RestaurantsListProps) {
  const { resetSignal } = useRestaurantsFilter();
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');

  // Second-row filter state
  const [priceRange, setPriceRange] = useState<PriceBounds | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');

  // Reset map-view when resizing to mobile
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

  const priceBounds = useMemo((): PriceBounds => {
    const prices = restaurants.flatMap(
      (r) => r.dishes?.map((d) => d.price) ?? [],
    );
    if (prices.length === 0) return { min: 0, max: 100 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [restaurants]);

  // Skip the initial mount so filters aren't cleared on first render.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setActiveFilter('all');
    setPriceRange(null);
    setDistanceKm(null);
    setSelectedRatings([]);
    setUserCoords(null);
    setLocationStatus('idle');
  }, [resetSignal]);

  const requestLocation = useCallback(() => {
    if (locationStatus === 'loading' || locationStatus === 'granted') return;
    setLocationStatus('loading');
    getUserLocation()
      .then((coords) => {
        setUserCoords(coords);
        setLocationStatus('granted');
      })
      .catch(() => setLocationStatus('denied'));
  }, [locationStatus]);

  const skipToAddress = useCallback(() => {
    setLocationStatus('denied');
  }, []);

  const handleCoordsFromAddress = useCallback((coords: UserCoords) => {
    setUserCoords(coords);
    setLocationStatus('granted');
  }, []);

  const filtered = useMemo(() => {
    // First-row filter
    let result: Restaurant[];
    switch (activeFilter) {
      case 'most-popular':
        result = restaurants.slice(0, 3);
        break;
      case 'new':
        result = restaurants.filter((r) => r.isNew);
        break;
      case 'open-now':
        result = restaurants.filter((r) =>
          isOpenNow(r.openingTime, r.closingTime),
        );
        break;
      default:
        result = restaurants;
    }

    // Price range filter
    if (priceRange !== null) {
      result = result.filter(
        (r) =>
          r.dishes?.some(
            (d) => d.price >= priceRange.min && d.price <= priceRange.max,
          ) ?? false,
      );
    }

    // Distance filter (only when user location is known)
    if (distanceKm !== null && userCoords !== null) {
      result = result.filter((r) => {
        if (r.latitude == null || r.longitude == null) return false;
        return (
          haversineKm(
            userCoords.latitude,
            userCoords.longitude,
            r.latitude,
            r.longitude,
          ) <= distanceKm
        );
      });
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      result = result.filter(
        (r) =>
          r.rating != null && selectedRatings.includes(Math.round(r.rating)),
      );
    }

    return result;
  }, [
    restaurants,
    activeFilter,
    priceRange,
    distanceKm,
    userCoords,
    selectedRatings,
  ]);

  return (
    <>
      <div className={styles.filtersWrapper}>
        <FilterNav
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>
      <div className={styles.filterBarWrapper}>
        <FilterBar
          priceBounds={priceBounds}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          distanceKm={distanceKm}
          locationLoading={locationStatus === 'loading'}
          locationGranted={locationStatus === 'granted'}
          locationDenied={locationStatus === 'denied'}
          onDistanceChange={setDistanceKm}
          onRequestLocation={requestLocation}
          onSkipToAddress={skipToAddress}
          onCoordsFromAddress={handleCoordsFromAddress}
          selectedRatings={selectedRatings}
          onRatingsChange={setSelectedRatings}
        />
      </div>
      {activeFilter === 'map-view' ? (
        <RestaurantsMap restaurants={filtered} />
      ) : filtered.length === 0 && activeFilter === 'open-now' ? (
        <p className={styles.emptyState}>{COPY.restaurants.openNowEmpty}</p>
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
