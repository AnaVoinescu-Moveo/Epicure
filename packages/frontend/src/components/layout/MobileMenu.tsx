'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MobileMenu.module.css';
import type { NavLink } from '../../constants/nav';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface MobileMenuProps {
  navLinks: NavLink[];
  footerLinks: NavLink[];
}

export function MobileMenu({ navLinks, footerLinks }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock(isOpen);
  useEscapeKey(() => setIsOpen(false), isOpen);

  // Focus close button when menu opens
  useEffect(() => {
    if (isOpen) panelRef.current?.querySelector<HTMLElement>('button')?.focus();
  }, [isOpen]);

  // Focus trap: keep Tab inside the panel
  useEffect(() => {
    if (!isOpen) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable =
        panelRef.current?.querySelectorAll<HTMLElement>('button, a[href]');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
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
                  src="/icons/x.svg"
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
                  className={`${styles.menuLink} ${pathname === href ? styles.active : ''}`}
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
