'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavLinks.module.css';
import { NAV_LINKS } from '../../constants/nav';
import { useRestaurantsFilter } from '../../context/RestaurantsFilterContext';
import { stripLocale } from '../../lib/locale';

export function NavLinks() {
  const pathname = usePathname();
  const localePathname = stripLocale(pathname);
  const { triggerReset } = useRestaurantsFilter();

  return (
    <nav className={styles.nav}>
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`${styles.link} ${localePathname === href ? styles.active : ''}`}
          onClick={() => {
            if (localePathname === href && href === '/restaurants') {
              triggerReset();
            }
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
