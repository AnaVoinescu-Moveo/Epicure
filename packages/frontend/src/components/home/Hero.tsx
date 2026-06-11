'use client';

import Image from 'next/image';
import { SearchInput } from '../search/SearchInput';
import { mockSearch } from '../../mocks/search';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.imageWrapper}>
        <Image
          src="/images/hero.png"
          alt="Epicure restaurant scene"
          fill
          className={styles.heroImage}
          priority
        />
      </div>
      <div className={styles.overlay}>
        <h1 className={styles.heading}>
          Epicure works with the top
          <br />
          chef restaurants in Tel Aviv
        </h1>
        <SearchInput
          iconPosition="left"
          autoFocus={false}
          className={styles.searchInput}
          onSearch={mockSearch}
        />
      </div>
    </section>
  );
}
