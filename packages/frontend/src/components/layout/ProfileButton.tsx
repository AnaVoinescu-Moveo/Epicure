'use client';

import Image from 'next/image';
import { COPY } from '../../constants/copy';
import { useAuthModal } from '../../context/AuthModalContext';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context/SearchContext';
import styles from './HeaderIcons.module.css';

export function ProfileButton() {
  const { openAuth } = useAuthModal();
  const { closeCart } = useCart();
  const { closeSearch } = useSearch();

  const handleOpenAuth = () => {
    closeCart();
    closeSearch();
    openAuth('login');
  };

  return (
    <button
      type="button"
      className={styles.iconBtn}
      aria-label={COPY.header.profileAriaLabel}
      onClick={handleOpenAuth}
    >
      <Image
        src="/icons/profile.png"
        alt=""
        width={20}
        height={20}
        className={`${styles.iconSm} ${styles.profileIcon}`}
      />
    </button>
  );
}
