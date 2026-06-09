import Link from 'next/link';
import styles from './Header.module.css';
import { MobileMenu } from './MobileMenu';
import { NavLinks } from './NavLinks';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Mobile only: hamburger button + slide-in menu panel */}
        <div className={styles.mobileLeft}>
          <MobileMenu />
        </div>

        {/* Logo — visible on both breakpoints */}
        <Link href="/" className={styles.logoGroup} aria-label="Epicure home">
          <img
            src="/icons/logoMobile.png"
            alt="Epicure"
            className={styles.logoIcon}
          />
          {/* EPICURE text — desktop only */}
          <span className={styles.logoText}>EPICURE</span>
        </Link>

        {/* Desktop only: nav links with active state */}
        <div className={styles.desktopNav}>
          <NavLinks />
        </div>

        {/* Right icons — visible on both breakpoints */}
        <div className={styles.rightIcons}>
          <button type="button" className={styles.iconBtn} aria-label="Search">
            <img src="/icons/search.png" alt="" className={styles.iconSm} />
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Profile">
            <img src="/icons/profile.png" alt="" className={styles.iconSm} />
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Cart">
            <img src="/icons/card.png" alt="" className={styles.iconSm} />
          </button>
        </div>
      </div>
    </header>
  );
}
