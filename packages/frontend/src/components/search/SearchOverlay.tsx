'use client';

import Image from 'next/image';
import { SearchInput } from './SearchInput';
import styles from './SearchOverlay.module.css';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface SearchOverlayProps {
  onClose: () => void;
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  useScrollLock(true);
  useEscapeKey(onClose, true);

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
          <Image src="/icons/x.svg" alt="" width={24} height={24} />
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
