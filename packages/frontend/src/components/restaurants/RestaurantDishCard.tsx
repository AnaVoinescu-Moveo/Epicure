'use client';

import Image from 'next/image';
import { strapiUrl, type Dish } from '@/lib/strapi';
import { COPY } from '@/constants/copy';
import { useDishModal } from '@/context/DishModalContext';
import styles from './RestaurantDishCard.module.css';

interface Props {
  dish: Dish;
}

export function RestaurantDishCard({ dish }: Props) {
  const { openDish } = useDishModal();
  const { name, description, price, image } = dish;
  const imageUrl = image ? strapiUrl(image.url) : null;

  return (
    <article
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={() => openDish(dish)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') openDish(dish);
      }}
    >
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={image?.alternativeText ?? name}
            fill
            sizes="(min-width: 1024px) 272px, 335px"
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.priceRow}>
          <span className={styles.price}>
            {COPY.signatureDishes.shekelSign}
            {price}
          </span>
        </div>
      </div>
    </article>
  );
}
