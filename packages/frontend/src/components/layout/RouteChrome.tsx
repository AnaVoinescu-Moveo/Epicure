'use client';

import { usePathname } from 'next/navigation';
import { stripLocale } from '@/lib/locale';
import styles from './RouteChrome.module.css';

// Routes that hide the global header entirely (they render their own).
const HEADER_HIDDEN_ON = ['/checkout'];

// Routes that pin the header/footer to the viewport edges, with only the
// content between them scrolling (a "fixed app shell"), instead of the
// normal sticky-header/scrolling-page layout used everywhere else.
const FIXED_SHELL_ON = ['/orders'];

interface RouteChromeProps {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export function RouteChrome({ header, footer, children }: RouteChromeProps) {
  const pathname = stripLocale(usePathname());

  if (FIXED_SHELL_ON.includes(pathname)) {
    return (
      <div className={styles.fixedShell}>
        <div className={styles.fixedHeader}>{header}</div>
        <main className={styles.fixedContent}>{children}</main>
        <div className={styles.fixedFooter}>{footer}</div>
      </div>
    );
  }

  return (
    <>
      {!HEADER_HIDDEN_ON.includes(pathname) && header}
      <main>{children}</main>
      {footer}
    </>
  );
}
