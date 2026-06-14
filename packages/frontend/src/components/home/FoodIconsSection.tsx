import Image from 'next/image';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { COPY } from '@/constants/copy';
import styles from './FoodIconsSection.module.css';

const ICONS = [
  {
    src: '/icons/Spicy.svg',
    alt: COPY.foodIcons.spicyAlt,
    label: COPY.foodIcons.spicyLabel,
    width: 46,
    height: 36,
  },
  {
    src: '/icons/Vegetarian.svg',
    alt: COPY.foodIcons.vegetarianAlt,
    label: COPY.foodIcons.vegetarianLabel,
    width: 77,
    height: 60,
  },
  {
    src: '/icons/Vegan.svg',
    alt: COPY.foodIcons.veganAlt,
    label: COPY.foodIcons.veganLabel,
    width: 77,
    height: 60,
  },
];

export function FoodIconsSection() {
  return (
    <section className={styles.section}>
      <SectionTitle>{COPY.foodIcons.sectionTitle}</SectionTitle>
      <div className={styles.iconsContainer}>
        {ICONS.map(({ src, alt, label, width, height }) => (
          <div key={label} className={styles.iconGroup}>
            <Image src={src} alt={alt} width={width} height={height} />
            <p className={styles.label}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
