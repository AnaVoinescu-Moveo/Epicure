'use client';

import Image from 'next/image';
import { SearchInput, SearchResultGroup } from '../search/SearchInput';
import styles from './Hero.module.css';

const MOCK_DATA: SearchResultGroup[] = [
  {
    label: 'Restaurants',
    items: [
      { type: 'restaurant', name: 'Tiger Lily', href: '/restaurants/tiger-lily' },
      { type: 'restaurant', name: 'The Blue Door', href: '/restaurants/blue-door' },
      { type: 'restaurant', name: 'Taizu', href: '/restaurants/taizu' },
    ],
  },
  {
    label: 'Cuisine',
    items: [
      { type: 'dish', name: 'Thai', href: '/restaurants?cuisine=thai' },
      { type: 'dish', name: 'Italian', href: '/restaurants?cuisine=italian' },
      { type: 'dish', name: 'Japanese', href: '/restaurants?cuisine=japanese' },
    ],
  },
  {
    label: 'Chef',
    items: [
      { type: 'chef', name: 'Tom Aviv', href: '/chefs/tom-aviv' },
      { type: 'chef', name: 'Tomer Agay', href: '/chefs/tomer-agay' },
    ],
  },
];

function mockSearch(query: string): SearchResultGroup[] {
  const q = query.toLowerCase();
  return MOCK_DATA.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.name.toLowerCase().startsWith(q),
    ),
  })).filter((group) => group.items.length > 0);
}

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
