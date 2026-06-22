'use client';

import Image from 'next/image';
import { SearchInput, type SearchResultGroup } from './SearchInput';
import styles from './SearchOverlay.module.css';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface SearchOverlayProps {
  onClose: () => void;
  onSearch?: (query: string) => SearchResultGroup[];
  onSelect?: () => void;
}

export function SearchOverlay({
  onClose,
  onSearch,
  onSelect,
}: SearchOverlayProps) {
  useScrollLock(true);
  useEscapeKey(onClose, true);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
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

      <div className={styles.inputWrapper}>
        <SearchInput
          iconPosition="left"
          autoFocus
          onSearch={onSearch}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}
