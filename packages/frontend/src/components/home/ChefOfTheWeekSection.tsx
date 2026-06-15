import Image from 'next/image';
import { getChefOfTheWeek } from '@/services/chefService';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import { strapiUrl } from '@/lib/strapi';
import { COPY } from '@/constants/copy';
import styles from './ChefOfTheWeekSection.module.css';

export async function ChefOfTheWeekSection() {
  let chef = null;

  try {
    chef = await getChefOfTheWeek();
  } catch (err) {
    console.error('[ChefOfTheWeekSection] Failed to fetch chef:', err);
    return null;
  }

  if (!chef) return null;

  const firstName = chef.name.split(' ')[0];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.titleRow}>
          <SectionTitle>{COPY.chefOfTheWeek.sectionTitle}</SectionTitle>
        </div>

        {chef.image && (
          <div className={styles.imageWrapper}>
            <Image
              src={strapiUrl(chef.image.url)}
              alt={chef.image.alternativeText ?? chef.name}
              fill
              className={styles.image}
            />
            <div className={styles.nameOverlay}>
              <span className={styles.chefName}>{chef.name}</span>
            </div>
          </div>
        )}

        {chef.description && (
          <div className={styles.rightColumn}>
            <p className={styles.description}>{chef.description}</p>
          </div>
        )}
      </div>

      <h3 className={styles.restaurantsTitle}>
        {COPY.chefOfTheWeek.restaurantsTitle(firstName)}
      </h3>

      <div className={styles.cards}>
        {chef.restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.documentId}
            restaurant={restaurant}
            hideChef
            compact
          />
        ))}
      </div>
    </section>
  );
}
