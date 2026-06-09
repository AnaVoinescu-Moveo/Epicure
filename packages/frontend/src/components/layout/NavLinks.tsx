'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavLinks.module.css';

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link
        href="/restaurants"
        className={`${styles.link} ${pathname === '/restaurants' ? styles.active : ''}`}
      >
        Restaurants
      </Link>
      <Link
        href="/chefs"
        className={`${styles.link} ${pathname === '/chefs' ? styles.active : ''}`}
      >
        Chefs
      </Link>
    </nav>
  );
}
