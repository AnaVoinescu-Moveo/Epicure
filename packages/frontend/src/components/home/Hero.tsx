import Image from 'next/image';
import { getAllRestaurants } from '@/services/restaurantService';
import { getAllChefs } from '@/services/chefService';
import type { Chef, Restaurant } from '@/lib/strapi';
import { HeroSearch } from './HeroSearch';
import styles from './Hero.module.css';

export async function Hero() {
  let restaurants: Restaurant[] = [];
  let chefs: Chef[] = [];
  try {
    [restaurants, chefs] = await Promise.all([
      getAllRestaurants(),
      getAllChefs(),
    ]);
  } catch {
    // Search renders with empty results if Strapi is unavailable
  }

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
        <HeroSearch restaurants={restaurants} chefs={chefs} />
      </div>
    </section>
  );
}
