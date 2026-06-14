import Image from 'next/image';
import Link from 'next/link';
import { strapiGet, type Restaurant, type StrapiListResponse } from '@/lib/strapi';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import { COPY } from '@/constants/copy';
import styles from './PopularRestaurantsSection.module.css';

export async function PopularRestaurantsSection() {
  let restaurants: Restaurant[] = [];

  try {
    const data = await strapiGet<StrapiListResponse<Restaurant>>(
      '/restaurants?sort=rating:desc&pagination[limit]=3&populate[chef]=true&populate[image]=true'
    );
    restaurants = data.data;
  } catch (err) {
    console.error('[PopularRestaurantsSection] Failed to fetch restaurants:', err);
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
          <span className={styles.ctaText}>{COPY.popularRestaurants.ctaText}</span>
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
