import Image from 'next/image';
import { strapiUrl, type Chef } from '@/lib/strapi';
import { ChefRestaurantCard } from './ChefRestaurantCard';
import { COPY } from '@/constants/copy';
import styles from './ChefDetailPage.module.css';

interface ChefDetailPageProps {
  chef: Chef;
}

export function ChefDetailPage({ chef }: ChefDetailPageProps) {
  const firstName = chef.name.split(' ')[0];

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* Left: chef image + name + description */}
        <div className={styles.left}>
          <div className={styles.imageWrapper}>
            {chef.image ? (
              <Image
                src={strapiUrl(chef.image.url)}
                alt={chef.image.alternativeText ?? chef.name}
                fill
                className={styles.image}
              />
            ) : (
              <div className={styles.imagePlaceholder} />
            )}
            <div className={styles.nameOverlay}>
              <span className={styles.chefName}>{chef.name}</span>
            </div>
          </div>
        </div>

        {/* Right: restaurants */}
        <div className={styles.right}>
          <h2 className={styles.restaurantsTitle}>
            {COPY.chefDetail.restaurantsTitle(firstName)}
          </h2>
          {chef.restaurants.length > 0 ? (
            <div className={styles.restaurantsCards}>
              {chef.restaurants.map((restaurant) => (
                <ChefRestaurantCard
                  key={restaurant.documentId}
                  restaurant={restaurant}
                />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>{COPY.chefDetail.noRestaurants}</p>
          )}
        </div>
      </div>
    </div>
  );
}
