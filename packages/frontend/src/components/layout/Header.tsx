import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import { MobileMenu } from './MobileMenu';
import { HeaderIcons } from './HeaderIcons';
import { DesktopNav } from './DesktopNav';
import { COPY } from '../../constants/copy';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Mobile only: hamburger button + slide-in menu panel */}
        <MobileMenu />

        {/* Logo — visible on both breakpoints */}
        <Link
          href="/"
          className={styles.logoGroup}
          aria-label={COPY.header.logoAriaLabel}
        >
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
        <DesktopNav />

        {/* Right icons — visible on both breakpoints */}
        <HeaderIcons />
      </div>
    </header>
  );
}
