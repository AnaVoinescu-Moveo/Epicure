import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import { MobileMenu } from './MobileMenu';
import { NavLinks } from './NavLinks';
import { HeaderSearch } from './HeaderSearch';
import { getAllRestaurants } from '@/services/restaurantService';
import { getAllChefs } from '@/services/chefService';

export async function Header() {
  let restaurants: Awaited<ReturnType<typeof getAllRestaurants>> = [];
  let chefs: Awaited<ReturnType<typeof getAllChefs>> = [];
  try {
    [restaurants, chefs] = await Promise.all([
      getAllRestaurants(),
      getAllChefs(),
    ]);
  } catch (err) {
    console.error('[Header] Failed to fetch search data:', err);
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Mobile only: hamburger + slide-in menu */}
        <div className={styles.mobileLeft}>
          <MobileMenu />
        </div>

        {/* Logo */}
        <Link href="/" className={styles.logoGroup} aria-label="Epicure home">
          <Image
            src="/icons/logoMobile.png"
            alt="Epicure"
            width={33}
            height={32}
            className={styles.logoIcon}
          />
          <span className={styles.logoText}>EPICURE</span>
        </Link>

        {/* Desktop nav */}
        <div className={styles.desktopNav}>
          <NavLinks />
        </div>

        {/* Right icons */}
        <div className={styles.rightIcons}>
          <HeaderSearch restaurants={restaurants} chefs={chefs} />
          <button type="button" className={styles.iconBtn} aria-label="Profile">
            <Image
              src="/icons/profile.png"
              alt=""
              width={20}
              height={20}
              className={`${styles.iconSm} ${styles.profileIcon}`}
            />
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Cart">
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
