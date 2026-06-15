import Link from 'next/link';
import Image from 'next/image';
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
            <Image
              src={imageUrl}
              alt={image?.alternativeText ?? name}
              fill
              className={styles.image}
            />
          ) : (
            <div className={styles.imagePlaceholder} />
          )}
        </div>
        <div className={styles.bottom}>
          <h3 className={styles.name}>{name}</h3>
          {description && <p className={styles.description}>{description}</p>}
          <div className={styles.bottomFixed}>
            {(isSpicy || isVegetarian || isVegan) && (
              <div className={styles.icons}>
                {isSpicy && (
                  <Image
                    src="/icons/Spicy.svg"
                    alt={COPY.signatureDishes.spicyAlt}
                    width={39}
                    height={30}
                  />
                )}
                {isVegetarian && (
                  <Image
                    src="/icons/Vegetarian.svg"
                    alt={COPY.signatureDishes.vegetarianAlt}
                    width={39}
                    height={30}
                  />
                )}
                {isVegan && (
                  <Image
                    src="/icons/Vegan.svg"
                    alt={COPY.signatureDishes.veganAlt}
                    width={39}
                    height={30}
                  />
                )}
              </div>
            )}
            <p className={styles.price}>
              <span>{COPY.signatureDishes.shekelSign}</span>
              <span>{price}</span>
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
