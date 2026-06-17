'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavLinks.module.css';
import { NAV_LINKS } from '../../constants/nav';

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`${styles.link} ${pathname === href ? styles.active : ''}`}
          onClick={() => {
            if (pathname === href && href === '/restaurants') {
              window.dispatchEvent(new CustomEvent('restaurants:reset'));
            }
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
