import Link from 'next/link';
import { strapiUrl, type Restaurant } from '@/lib/strapi';
import { RatingStars } from '@/components/ui/RatingStars';
import styles from './RestaurantCard.module.css';

// TODO: remove once chef names are entered in Strapi
const CHEF_NAME_OVERRIDES: Record<string, string> = {
  Claro: 'Ran Shmueli',
  'kab kem': 'Aviv Moshe',
};

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { name, image, rating, chef } = restaurant;
  const imageUrl = image ? strapiUrl(image.url) : null;
  const chefName = chef?.name ?? CHEF_NAME_OVERRIDES[name] ?? null;

  return (
    <Link href={`/restaurants/${restaurant.documentId}`} className={styles.link}>
      <article className={styles.card}>
        <div className={styles.imageWrapper}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={image?.alternativeText ?? name}
              className={styles.image}
            />
          ) : (
            <div className={styles.imagePlaceholder} />
          )}
        </div>
        <div className={styles.bottom}>
          <h3 className={styles.name}>{name}</h3>
          {chefName ? (
            <p className={styles.chef}>{chefName}</p>
          ) : (
            // TODO: Add chef name in Strapi for this restaurant
            <p className={styles.chefPlaceholder}>&nbsp;</p>
          )}
          <RatingStars rating={rating ?? 0} />
        </div>
      </article>
    </Link>
  );
}
