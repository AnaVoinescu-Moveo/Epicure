import Image from 'next/image';
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
  hideChef?: boolean;
  compact?: boolean;
}

export function RestaurantCard({
  restaurant,
  hideChef = false,
  compact = false,
}: RestaurantCardProps) {
  const { name, image, rating, chef } = restaurant;
  const imageUrl = image ? strapiUrl(image.url) : null;
  const chefName = chef?.name ?? CHEF_NAME_OVERRIDES[name] ?? null;

  const inner = (
    <article
      className={`${styles.card}${compact ? ` ${styles.cardCompact}` : ''}`}
    >
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={image?.alternativeText ?? name}
            fill
            sizes={compact ? '231px' : '(min-width: 1024px) 379px, 245px'}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>
      <div className={styles.bottom}>
        <h3 className={styles.name}>{name}</h3>
        {!hideChef &&
          (chefName ? (
            <p className={styles.chef}>{chefName}</p>
          ) : (
            // TODO: Add chef name in Strapi for this restaurant
            <p className={styles.chefPlaceholder}>&nbsp;</p>
          ))}
        <div className={styles.rating}>
          <RatingStars rating={rating ?? 0} />
        </div>
      </div>
    </article>
  );

  if (compact) return inner;

  return (
    <Link
      href={`/restaurants/${restaurant.documentId}`}
      className={styles.link}
    >
      {inner}
    </Link>
  );
}
