import Link from 'next/link';
import { strapiUrl, type Restaurant } from '@/lib/strapi';
import { RatingStars } from '@/components/ui/RatingStars';
import styles from './ChefRestaurantCard.module.css';

interface ChefRestaurantCardProps {
  restaurant: Restaurant;
}

export function ChefRestaurantCard({ restaurant }: ChefRestaurantCardProps) {
  const { name, image, rating } = restaurant;
  const imageUrl = image ? strapiUrl(image.url) : null;

  return (
    <Link
      href={`/restaurants/${restaurant.documentId}`}
      className={styles.link}
    >
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
          {rating !== null && (
            <div className={styles.rating}>
              <RatingStars rating={rating} />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
