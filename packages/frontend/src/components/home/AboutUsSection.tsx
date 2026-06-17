import Image from 'next/image';
import { COPY } from '@/constants/copy';
import styles from './AboutUsSection.module.css';

export function AboutUsSection() {
  return (
    <section className={styles.section}>
      <Image
        src="/images/Logo.png"
        alt={COPY.aboutUs.logoAlt}
        width={102}
        height={95}
        className={styles.logo}
      />

      <Image
        src="/images/google.png"
        alt={COPY.aboutUs.googleAlt}
        width={180}
        height={52}
        className={styles.googleImage}
      />

      <Image
        src="/images/apple.png"
        alt={COPY.aboutUs.appleAlt}
        width={180}
        height={52}
        className={styles.appleImage}
      />

      <h2 className={styles.aboutTitle}>{COPY.aboutUs.title}</h2>

      <div className={styles.textBlock}>
        <p className={styles.paragraph}>{COPY.aboutUs.paragraph1}</p>
        <p className={styles.paragraph}>{COPY.aboutUs.paragraph2}</p>
      </div>
    </section>
  );
}
