import Image from 'next/image';
import Link from 'next/link';
import { strapiUrl, type Dish } from '@/lib/strapi';
import { COPY } from '@/constants/copy';
import styles from './DishCard.module.css';

interface DishCardProps {
  dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
  const { name, description, price, isSpicy, isVegetarian, isVegan, image } =
    dish;
  const imageUrl = image ? strapiUrl(image.url) : null;

  return (
    <Link href={`/dishes/${dish.documentId}`} className={styles.link}>
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
          {description && <p className={styles.description}>{description}</p>}
          {(isSpicy || isVegetarian || isVegan) && (
            <div className={styles.icons}>
              {isSpicy && (
                <Image
                  src="/icons/Spicy.svg"
                  alt={COPY.signatureDishes.spicyAlt}
                  width={20}
                  height={20}
                />
              )}
              {isVegetarian && (
                <Image
                  src="/icons/Vegetarian.svg"
                  alt={COPY.signatureDishes.vegetarianAlt}
                  width={20}
                  height={20}
                />
              )}
              {isVegan && (
                <Image
                  src="/icons/Vegan.svg"
                  alt={COPY.signatureDishes.veganAlt}
                  width={20}
                  height={20}
                />
              )}
            </div>
          )}
          <div className={styles.price}>
            <Image
              src="/icons/shekel.svg"
              alt={COPY.signatureDishes.shekelAlt}
              width={8}
              height={11}
            />
            <span className={styles.priceValue}>{price}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
