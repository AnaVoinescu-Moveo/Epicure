'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavLinks.module.css';
import type { NavLink } from '../../constants/nav';
import { useRestaurantsFilter } from '../../context/RestaurantsFilterContext';
import { stripLocale } from '../../lib/locale';

interface NavLinksProps {
  links: NavLink[];
}

export function NavLinks({ links }: NavLinksProps) {
  const pathname = usePathname();
  const localePathname = stripLocale(pathname);
  const { triggerReset } = useRestaurantsFilter();

  return (
    <nav className={styles.nav}>
      {links.map(({ href, label }) => (
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
