import Image from 'next/image';
import Link from 'next/link';
import { strapiGet, type Dish, type StrapiListResponse } from '@/lib/strapi';
import { COPY } from '@/constants/copy';
import { DishCard } from '@/components/dishes/DishCard';
import styles from './SignatureDishesSection.module.css';

async function getSignatureDishes(): Promise<Dish[]> {
  try {
    const data = await strapiGet<StrapiListResponse<Dish>>(
      '/dishes?filters[isSignature][$eq]=true&pagination[limit]=3&populate[image]=true',
    );
    return data.data ?? [];
  } catch (err) {
    console.error('[SignatureDishesSection] Failed to fetch dishes:', err);
    return [];
  }
}

export async function SignatureDishesSection() {
  const dishes = await getSignatureDishes();

  if (dishes.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{COPY.signatureDishes.sectionTitle}</h2>
      <div className={styles.carousel}>
        {dishes.map((dish) => (
          <DishCard key={dish.documentId} dish={dish} />
        ))}
      </div>
      <div className={styles.ctaWrapper}>
        <Link href="/restaurants" className={styles.cta}>
          <span className={styles.ctaText}>{COPY.signatureDishes.ctaText}</span>
          <Image
            src="/icons/Erow.svg"
            alt={COPY.signatureDishes.ctaArrowAlt}
            width={24}
            height={18}
          />
        </Link>
      </div>
    </section>
  );
}
