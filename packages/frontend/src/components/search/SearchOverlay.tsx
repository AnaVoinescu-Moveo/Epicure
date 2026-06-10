'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { SearchInput } from './SearchInput';
import styles from './SearchOverlay.module.css';

interface SearchOverlayProps {
  onClose: () => void;
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Top row: X button + Search title */}
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.closeBtn}
          aria-label="Close search"
          onClick={onClose}
        >
          <Image src="/icons/x.png" alt="" width={24} height={24} />
        </button>
        <span className={styles.title}>Search</span>
      </div>

      {/* Search input */}
      <div className={styles.inputWrapper}>
        <SearchInput iconPosition="left" />
      </div>
    </div>
  );
}
