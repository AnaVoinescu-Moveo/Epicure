'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MobileMenu.module.css';
import type { NavLink } from '../../constants/nav';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { stripLocale } from '../../lib/locale';

interface MobileMenuProps {
  navLinks: NavLink[];
  footerLinks: NavLink[];
}

export function MobileMenu({ navLinks, footerLinks }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const localePathname = stripLocale(pathname);
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock(isOpen);
  useEscapeKey(() => setIsOpen(false), isOpen);
  useFocusTrap(panelRef, isOpen);

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

          <div
            ref={panelRef}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Section 1: close button */}
            <div className={styles.closeRow}>
              <button
                type="button"
                className={styles.closeBtn}
                aria-label="Close navigation menu"
                onClick={() => setIsOpen(false)}
              >
                <Image
                  src="/icons/x.png"
                  alt=""
                  width={15}
                  height={15}
                  className={styles.closeIcon}
                />
              </button>
            </div>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Section 2: nav + footer links */}
            <nav className={styles.menuNav}>
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`${styles.menuLink} ${localePathname === href ? styles.active : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ))}

              <div className={styles.divider} />

              {footerLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={styles.menuLink}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
