'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './Header.module.css';
import { SearchOverlay } from '../search/SearchOverlay';
import { SearchInput } from '../search/SearchInput';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useIsClickedOutside } from '../../hooks/useIsClickedOutside';

export function HeaderSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  // Track viewport to distinguish mobile overlay vs desktop inline input
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
            src="/icons/search.svg"
            alt=""
            width={20}
            height={20}
            className={`${styles.iconSm} ${styles.searchIcon}`}
          />
        </button>
      )}

      {/* Mobile search overlay — position:fixed so DOM location doesn't matter */}
      {isSearchOpen && !isDesktop && <SearchOverlay onClose={closeSearch} />}
    </>
  );
}
