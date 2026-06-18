import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import { COPY } from '@/constants/copy';
import type { Restaurant } from '@/lib/strapi';
import styles from './CuisineRestaurantsPage.module.css';

interface CuisineRestaurantsPageProps {
  cuisineLabel: string;
  restaurants: Restaurant[];
}

export function CuisineRestaurantsPage({
  cuisineLabel,
  restaurants,
}: CuisineRestaurantsPageProps) {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{cuisineLabel}</h1>
      {restaurants.length === 0 ? (
        <p className={styles.empty}>{COPY.cuisine.empty}</p>
      ) : (
        <div className={styles.list}>
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.documentId}
              restaurant={restaurant}
              page
            />
          ))}
        </div>
      )}
    </main>
  );
}
