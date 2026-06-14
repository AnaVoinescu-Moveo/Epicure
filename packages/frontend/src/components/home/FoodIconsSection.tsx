import Image from 'next/image';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { COPY } from '@/constants/copy';
import styles from './FoodIconsSection.module.css';

const ICONS = [
  {
    src: '/icons/Spicy.svg',
    alt: COPY.foodIcons.spicyAlt,
    label: COPY.foodIcons.spicyLabel,
    wrapperClassName: styles.iconWrapperSpicy,
  },
  {
    src: '/icons/Vegetarian.svg',
    alt: COPY.foodIcons.vegetarianAlt,
    label: COPY.foodIcons.vegetarianLabel,
    wrapperClassName: styles.iconWrapperLarge,
  },
  {
    src: '/icons/Vegan.svg',
    alt: COPY.foodIcons.veganAlt,
    label: COPY.foodIcons.veganLabel,
    wrapperClassName: styles.iconWrapperLarge,
  },
];

export function FoodIconsSection() {
  return (
    <section className={styles.section}>
      <SectionTitle>{COPY.foodIcons.sectionTitle}</SectionTitle>
      <div className={styles.iconsContainer}>
        {ICONS.map(({ src, alt, label, wrapperClassName }) => (
          <div key={label} className={styles.iconGroup}>
            <div className={wrapperClassName}>
              <Image src={src} alt={alt} width={77} height={60} className={styles.iconImage} />
            </div>
            <p className={styles.label}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
