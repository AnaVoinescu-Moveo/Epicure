import Image from 'next/image';
import { COPY } from '../../constants/copy';
import styles from './HeaderIcons.module.css';

export function HeaderIcons() {
  return (
    <div className={styles.rightIcons}>
      <button
        type="button"
        className={styles.iconBtn}
        aria-label={COPY.header.searchAriaLabel}
      >
        <Image
          src="/icons/search.png"
          alt=""
          width={20}
          height={20}
          className={`${styles.iconSm} ${styles.searchIcon}`}
        />
      </button>
      <button
        type="button"
        className={styles.iconBtn}
        aria-label={COPY.header.profileAriaLabel}
      >
        <Image
          src="/icons/profile.png"
          alt=""
          width={20}
          height={20}
          className={`${styles.iconSm} ${styles.profileIcon}`}
        />
      </button>
      <button
        type="button"
        className={styles.iconBtn}
        aria-label={COPY.header.cartAriaLabel}
      >
        <Image
          src="/icons/card.png"
          alt=""
          width={20}
          height={20}
          className={`${styles.iconSm} ${styles.cartIcon}`}
        />
      </button>
    </div>
  );
}
