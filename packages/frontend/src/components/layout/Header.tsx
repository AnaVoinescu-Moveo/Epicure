'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import { MobileMenu } from './MobileMenu';
import { NavLinks } from './NavLinks';
import { SearchOverlay } from '../search/SearchOverlay';
import { SearchInput } from '../search/SearchInput';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useIsClickedOutside } from '../../hooks/useIsClickedOutside';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  // Track whether we're on desktop — avoids rendering inline input on mobile
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
      <header className={styles.header}>
        <div className={styles.inner}>
          {/* Mobile only: hamburger + slide-in menu */}
          <div className={styles.mobileLeft}>
            <MobileMenu />
          </div>

          {/* Logo */}
          <Link href="/" className={styles.logoGroup} aria-label="Epicure home">
            <Image
              src="/icons/logoMobile.png"
              alt="Epicure"
              width={33}
              height={32}
              className={styles.logoIcon}
            />
            <span className={styles.logoText}>EPICURE</span>
          </Link>

          {/* Desktop nav */}
          <div className={styles.desktopNav}>
            <NavLinks />
          </div>

          {/* Right icons */}
          <div className={styles.rightIcons}>
            {/* Desktop inline search — only rendered when confirmed desktop */}
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

            <button
              type="button"
              className={styles.iconBtn}
              aria-label="Profile"
            >
              <Image
                src="/icons/profile.svg"
                alt=""
                width={20}
                height={20}
                className={`${styles.iconSm} ${styles.profileIcon}`}
              />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Cart">
              <Image
                src="/icons/card.svg"
                alt=""
                width={20}
                height={20}
                className={`${styles.iconSm} ${styles.cartIcon}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      {isSearchOpen && !isDesktop && <SearchOverlay onClose={closeSearch} />}
    </>
  );
}
