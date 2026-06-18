import { type Chef, strapiUrl } from '@/lib/strapi';
import styles from './ChefCard.module.css';

interface ChefCardProps {
  chef: Chef;
}

export function ChefCard({ chef }: ChefCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {chef.image ? (
          <img
            src={strapiUrl(chef.image.url)}
            alt={chef.image.alternativeText ?? chef.name}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>
      <div className={styles.overlay}>
        <span className={styles.name}>{chef.name}</span>
      </div>
    </div>
  );
}
