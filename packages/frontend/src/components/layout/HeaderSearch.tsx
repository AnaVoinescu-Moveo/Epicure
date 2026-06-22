'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import styles from './Header.module.css';
import { SearchOverlay } from '../search/SearchOverlay';
import { SearchInput } from '../search/SearchInput';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useIsClickedOutside } from '../../hooks/useIsClickedOutside';
import { buildSearchFn } from '@/lib/searchUtils';
import type { Chef, Restaurant } from '@/lib/strapi';

interface HeaderSearchProps {
  restaurants: Restaurant[];
  chefs: Chef[];
}

export function HeaderSearch({ restaurants, chefs }: HeaderSearchProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const onSearch = useMemo(
    () => buildSearchFn(restaurants, chefs),
    [restaurants, chefs],
  );
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEscapeKey(closeSearch, isSearchOpen && isDesktop);
  useIsClickedOutside(searchRef, closeSearch, isSearchOpen && isDesktop);

  return (
    <>
      {isDesktop && isSearchOpen ? (
        <div ref={searchRef}>
          <SearchInput
            iconPosition="right"
            className={styles.desktopSearchInput}
            onSearch={onSearch}
            onSelect={closeSearch}
          />
        </div>
      ) : (
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Search"
          onClick={() => setIsSearchOpen(true)}
        >
          <Image
            src="/icons/search.png"
            alt=""
            width={20}
            height={20}
            className={`${styles.iconSm} ${styles.searchIcon}`}
          />
        </button>
      )}

      {isSearchOpen && !isDesktop && (
        <SearchOverlay
          onClose={closeSearch}
          onSearch={onSearch}
          onSelect={closeSearch}
        />
      )}
    </>
  );
}
