import { getAllRestaurants } from '@/services/restaurantService';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import { FilterNav } from '@/components/restaurants/FilterNav';
import { FilterBar } from '@/components/restaurants/FilterBar';
import { ScrollToTop } from '@/components/restaurants/ScrollToTop';
import { COPY } from '@/constants/copy';
import styles from './RestaurantsPage.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: COPY.restaurants.pageTitle,
};

export default async function RestaurantsPage() {
  const restaurants = await getAllRestaurants();

  return (
    <main className={styles.page}>
      <ScrollToTop />
      <h1 className={styles.title}>{COPY.restaurants.pageTitle}</h1>
      <div className={styles.filtersWrapper}>
        <FilterNav />
      </div>
      <div className={styles.filterBarWrapper}>
        <FilterBar />
      </div>
      <div className={styles.list}>
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} page />
        ))}
      </div>
    </main>
  );
}
