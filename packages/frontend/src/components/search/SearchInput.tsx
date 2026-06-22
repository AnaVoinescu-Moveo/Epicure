'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSearchKeyboard } from '../../hooks/useSearchKeyboard';
import { useClickOutside } from '../../hooks/useClickOutside';
import { COPY } from '../../constants/copy';
import styles from './SearchInput.module.css';

export interface SearchResult {
  type: 'restaurant' | 'chef' | 'dish' | 'cuisine';
  name: string;
  href: string;
}

export interface SearchResultGroup {
  label: string;
  items: SearchResult[];
}

interface SearchInputProps {
  iconPosition?: 'left' | 'right';
  className?: string;
  autoFocus?: boolean;
  onSearch?: (query: string) => SearchResultGroup[];
  onSelect?: () => void;
}

export function SearchInput({
  iconPosition = 'left',
  className,
  autoFocus = false,
  onSearch,
  onSelect,
}: SearchInputProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [groups, setGroups] = useState<SearchResultGroup[]>([]);

  const flatItems = groups.flatMap((g) => g.items);
  const hasResults = flatItems.length > 0;
  const showNoResults = !!query.trim() && onSearch && groups.length === 0;

  // Precompute href→flatIndex map so render stays pure (no mutable counter)
  const itemIndexMap = new Map(flatItems.map((item, i) => [item.href, i]));

  const handleSelect = (href: string) => {
    router.push(href);
    setGroups([]);
    setQuery('');
    onSelect?.();
  };

  const { activeIndex, setActiveIndex, handleKeyDown } = useSearchKeyboard(
    flatItems.length,
    (index) => handleSelect(flatItems[index].href),
  );

  useClickOutside(wrapperRef, () => {
    setGroups([]);
    setQuery('');
  });

  const handleChange = (value: string) => {
    setQuery(value);
    setActiveIndex(-1);
    if (onSearch && value.trim()) {
      setGroups(onSearch(value));
    } else {
      setGroups([]);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
    >
      {iconPosition === 'left' && (
        <span className={styles.icon}>
          <Image src="/icons/search.png" alt="" width={20} height={20} />
        </span>
      )}
      <input
        type="search"
        className={styles.input}
        placeholder={COPY.search.placeholder}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label={COPY.search.ariaLabel}
        aria-autocomplete="list"
        aria-expanded={hasResults || showNoResults}
        autoFocus={autoFocus}
      />
      {iconPosition === 'right' && (
        <span className={styles.icon}>
          <Image src="/icons/search.png" alt="" width={20} height={20} />
        </span>
      )}
      {showNoResults && (
        <div className={styles.dropdown} role="status">
          <p className={styles.noResults}>{COPY.search.noResults}</p>
        </div>
      )}
      {hasResults && (
        <ul className={styles.dropdown} role="listbox">
          {groups.map((group) =>
            group.items.length > 0 ? (
              <li key={group.label} className={styles.group}>
                <span className={styles.groupLabel}>{group.label}:</span>
                <ul>
                  {group.items.map((item) => {
                    const currentIndex = itemIndexMap.get(item.href) ?? -1;
                    return (
                      <li
                        key={item.href}
                        role="option"
                        aria-selected={currentIndex === activeIndex}
                        className={[
                          styles.dropdownItem,
                          currentIndex === activeIndex ? styles.active : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => handleSelect(item.href)}
                        onMouseEnter={() => setActiveIndex(currentIndex)}
                      >
                        {item.name}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ) : null,
          )}
        </ul>
      )}
    </div>
  );
}
