import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import { MobileMenu } from './MobileMenu';
import { NavLinks } from './NavLinks';
import { COPY } from '../../constants/copy';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Mobile only: hamburger button + slide-in menu panel */}
        <div className={styles.mobileLeft}>
          <MobileMenu />
        </div>

        {/* Logo — visible on both breakpoints */}
        <Link href="/" className={styles.logoGroup} aria-label={COPY.header.logoAriaLabel}>
          <Image
            src="/icons/logoMobile.png"
            alt={COPY.header.logoAlt}
            width={33}
            height={32}
            className={styles.logoIcon}
          />
          {/* EPICURE text — desktop only */}
          <span className={styles.logoText}>{COPY.header.logoText}</span>
        </Link>

        {/* Desktop only: nav links with active state */}
        <div className={styles.desktopNav}>
          <NavLinks />
        </div>

        {/* Right icons — visible on both breakpoints */}
        <div className={styles.rightIcons}>
          <button type="button" className={styles.iconBtn} aria-label={COPY.header.searchAriaLabel}>
            <Image
              src="/icons/search.png"
              alt=""
              width={20}
              height={20}
              className={`${styles.iconSm} ${styles.searchIcon}`}
            />
          </button>
          <button type="button" className={styles.iconBtn} aria-label={COPY.header.profileAriaLabel}>
            <Image
              src="/icons/profile.png"
              alt=""
              width={20}
              height={20}
              className={`${styles.iconSm} ${styles.profileIcon}`}
            />
          </button>
          <button type="button" className={styles.iconBtn} aria-label={COPY.header.cartAriaLabel}>
            <Image
              src="/icons/card.png"
              alt=""
              width={20}
              height={20}
              className={`${styles.iconSm} ${styles.cartIcon}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
