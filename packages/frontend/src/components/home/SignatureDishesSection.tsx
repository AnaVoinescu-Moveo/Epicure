import Image from 'next/image';
import Link from 'next/link';
import { getSignatureDishes } from '@/services/dishService';
import { COPY } from '@/constants/copy';
import { DishCard } from '@/components/dishes/DishCard';
import styles from './SignatureDishesSection.module.css';

export async function SignatureDishesSection() {
  let dishes = [];

  try {
    dishes = await getSignatureDishes();
  } catch (err) {
    console.error('[SignatureDishesSection] Failed to fetch dishes:', err);
    return null;
  }

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
