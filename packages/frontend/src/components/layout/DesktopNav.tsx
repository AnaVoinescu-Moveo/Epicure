import styles from './DesktopNav.module.css';
import { NavLinks } from './NavLinks';

export function DesktopNav() {
  return (
    <div className={styles.desktopNav}>
      <NavLinks />
    </div>
  );
}
