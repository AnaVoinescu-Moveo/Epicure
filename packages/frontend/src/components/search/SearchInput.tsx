'use client';

import { useState, KeyboardEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './SearchInput.module.css';

export interface SearchResult {
  type: 'restaurant' | 'chef' | 'dish';
  name: string;
  href: string;
}

interface SearchInputProps {
  iconPosition?: 'left' | 'right';
  className?: string;
  onSearch?: (query: string) => SearchResult[];
}

export function SearchInput({
  iconPosition = 'left',
  className,
  onSearch,
}: SearchInputProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const navigate = (href: string) => router.push(href);

  const handleChange = (value: string) => {
    setQuery(value);
    setActiveIndex(-1);
    if (onSearch && value.trim()) {
      setResults(onSearch(value));
    } else {
      setResults([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      navigate(results[activeIndex].href);
    }
  };

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {iconPosition === 'left' && (
        <span className={styles.icon}>
          <Image
            src={query === '' ? '/icons/_.svg' : '/icons/search.svg'}
            alt=""
            width={20}
            height={20}
          />
        </span>
      )}
      <input
        type="search"
        className={styles.input}
        placeholder="Search for restaurant cuisine, chef"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Search"
        aria-autocomplete="list"
        aria-expanded={results.length > 0}
        autoFocus
      />
      {iconPosition === 'right' && (
        <span className={styles.icon}>
          <Image src="/icons/search.svg" alt="" width={20} height={20} />
        </span>
      )}
      {results.length > 0 && (
        <ul className={styles.dropdown} role="listbox">
          {results.map((result, i) => (
            <li
              key={result.href}
              role="option"
              aria-selected={i === activeIndex}
              className={[
                styles.dropdownItem,
                i === activeIndex ? styles.active : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => navigate(result.href)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span className={styles.resultType}>{result.type}</span>
              <span>{result.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
