import Image from 'next/image';
import Link from 'next/link';
import { getPopularRestaurants } from '@/services/restaurantService';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import { COPY } from '@/constants/copy';
import styles from './PopularRestaurantsSection.module.css';

export async function PopularRestaurantsSection() {
  let restaurants = [];

  try {
    restaurants = await getPopularRestaurants();
  } catch (err) {
    console.error(
      '[PopularRestaurantsSection] Failed to fetch restaurants:',
      err,
    );
    return null;
  }

  if (restaurants.length === 0) return null;

  return (
    <section className={styles.section}>
      <SectionTitle>{COPY.popularRestaurants.sectionTitle}</SectionTitle>
      <div className={styles.grid}>
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
      <div className={styles.ctaWrapper}>
        <Link href="/restaurants" className={styles.cta}>
          <span className={styles.ctaText}>
            {COPY.popularRestaurants.ctaText}
          </span>
          <Image
            src="/icons/Erow.svg"
            alt={COPY.popularRestaurants.ctaArrowAlt}
            width={24}
            height={18}
          />
        </Link>
      </div>
    </section>
  );
}
