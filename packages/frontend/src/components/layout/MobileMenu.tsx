'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MobileMenu.module.css';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        className={styles.hamburger}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <span className={styles.linesWrapper}>
          <span className={styles.line} />
          <span className={styles.line} />
          <span className={styles.line} />
        </span>
      </button>

      {/* Menu panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className={styles.backdrop}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className={styles.panel} role="dialog" aria-modal="true">
            {/* Section 1: close button */}
            <div className={styles.closeRow}>
              <button
                type="button"
                className={styles.closeBtn}
                aria-label="Close navigation menu"
                onClick={() => setIsOpen(false)}
              >
                <img src="/icons/x.png" alt="" className={styles.closeIcon} />
              </button>
            </div>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Section 2: nav + footer links */}
            <nav className={styles.menuNav}>
              <Link
                href="/restaurants"
                className={`${styles.menuLink} ${pathname === '/restaurants' ? styles.active : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Restaurants
              </Link>
              <Link
                href="/chefs"
                className={`${styles.menuLink} ${pathname === '/chefs' ? styles.active : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Chefs
              </Link>

              <div className={styles.divider} />

              <Link
                href="/contact"
                className={styles.menuLink}
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
              <Link
                href="/terms"
                className={styles.menuLink}
                onClick={() => setIsOpen(false)}
              >
                Terms of Use
              </Link>
              <Link
                href="/privacy"
                className={styles.menuLink}
                onClick={() => setIsOpen(false)}
              >
                Privacy Policy
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
