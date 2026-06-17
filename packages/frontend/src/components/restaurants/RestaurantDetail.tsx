import Image from 'next/image';
import { strapiUrl, type Restaurant } from '@/lib/strapi';
import { isOpenNow } from '@/lib/time';
import { COPY } from '@/constants/copy';
import { MealFilterSection } from './MealFilterSection';
import styles from './RestaurantDetail.module.css';

interface Props {
  restaurant: Restaurant;
}

export function RestaurantDetail({ restaurant }: Props) {
  const { name, image, chef, openingTime, closingTime, dishes } = restaurant;
  const imageUrl = image ? strapiUrl(image.url) : null;
  const isOpen = isOpenNow(openingTime, closingTime);

  return (
    <div className={styles.page}>
      <div className={styles.heroWrapper}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={image?.alternativeText ?? name}
            fill
            sizes="(min-width: 1024px) 1186px, 100vw"
            className={styles.heroImage}
            priority
          />
        ) : (
          <div className={styles.heroPlaceholder} />
        )}
      </div>
      <div className={styles.content}>
        <h1 className={styles.name}>{name}</h1>
        {chef?.name && <p className={styles.chef}>{chef.name}</p>}
        <div className={styles.status}>
          <Image
            src="/icons/clock.svg"
            alt={COPY.restaurantDetail.clockAlt}
            width={20}
            height={20}
          />
          <span className={styles.statusText}>
            {isOpen ? COPY.restaurantDetail.openNow : COPY.restaurantDetail.closedNow}
          </span>
        </div>
        <MealFilterSection dishes={dishes ?? []} />
      </div>
    </div>
  );
}
