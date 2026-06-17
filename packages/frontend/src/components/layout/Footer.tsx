import Link from 'next/link';
import { FOOTER_LINKS } from '@/constants/nav';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.inner}>
        {FOOTER_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className={styles.link}>
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
