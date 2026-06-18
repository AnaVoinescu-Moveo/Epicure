import Link from 'next/link';
import { FOOTER_LINKS } from '@/constants/nav';
import { getFooter } from '@/services/footerService';
import styles from './Footer.module.css';

export async function Footer() {
  const data = await getFooter();
  const footerLinks = data?.footerLinks?.length ? data.footerLinks : FOOTER_LINKS;

  return (
    <footer className={styles.footer}>
      <nav className={styles.inner}>
        {footerLinks.map(({ href, label }) => (
          <Link key={href} href={href} className={styles.link}>
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
