import { getAllRestaurants } from '@/services/restaurantService';
import { RestaurantsList } from '@/components/restaurants/RestaurantsList';
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
      <RestaurantsList restaurants={restaurants} />
    </main>
  );
}
