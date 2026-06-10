'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import { MobileMenu } from './MobileMenu';
import { NavLinks } from './NavLinks';
import { SearchOverlay } from '../search/SearchOverlay';
import { SearchInput } from '../search/SearchInput';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isSearchOpen]);

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
            {/* Desktop: inline search input replaces the button when open */}
            {isSearchOpen ? (
              <SearchInput
                iconPosition="right"
                className={styles.desktopSearchInput}
              />
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

            <button
              type="button"
              className={styles.iconBtn}
              aria-label="Profile"
            >
              <Image
                src="/icons/profile.png"
                alt=""
                width={20}
                height={20}
                className={`${styles.iconSm} ${styles.profileIcon}`}
              />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Cart">
              <Image
                src="/icons/card.png"
                alt=""
                width={20}
                height={20}
                className={`${styles.iconSm} ${styles.cartIcon}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile search overlay — only renders on mobile via CSS */}
      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
