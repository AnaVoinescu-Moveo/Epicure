import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import { MobileMenu } from './MobileMenu';
import { NavLinks } from './NavLinks';
import { HeaderSearch } from './HeaderSearch';
import { getAllRestaurants } from '@/services/restaurantService';
import { getAllChefs } from '@/services/chefService';
import { getHeader } from '@/services/headerService';
import { getFooter } from '@/services/footerService';
import { NAV_LINKS, FOOTER_LINKS } from '@/constants/nav';

export async function Header() {
  let restaurants: Awaited<ReturnType<typeof getAllRestaurants>> = [];
  let chefs: Awaited<ReturnType<typeof getAllChefs>> = [];
  let navLinks = NAV_LINKS;
  let footerLinks = FOOTER_LINKS;
  try {
    [restaurants, chefs] = await Promise.all([getAllRestaurants(), getAllChefs()]);
  } catch {
    // Search renders with empty results if Strapi is unavailable
  }
  const [headerData, footerData] = await Promise.all([getHeader(), getFooter()]);
  if (headerData?.navLinks?.length) navLinks = headerData.navLinks;
  if (footerData?.footerLinks?.length) footerLinks = footerData.footerLinks;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Mobile only: hamburger + slide-in menu */}
        <div className={styles.mobileLeft}>
          <MobileMenu navLinks={navLinks} footerLinks={footerLinks} />
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
          <NavLinks links={navLinks} />
        </div>

        {/* Right icons */}
        <div className={styles.rightIcons}>
          <HeaderSearch restaurants={restaurants} chefs={chefs} />
          <button type="button" className={styles.iconBtn} aria-label="Profile">
            <Image
              src="/icons/profile.svg"
              alt=""
              width={20}
              height={20}
              className={`${styles.iconSm} ${styles.profileIcon}`}
            />
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Cart">
            <Image
              src="/icons/card.svg"
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
