'use client';

import Image from 'next/image';
import { COPY } from '../../constants/copy';
import { useCart } from '../../context/CartContext';
import { useAuthModal } from '../../context/AuthModalContext';
import { useSearch } from '../../context/SearchContext';
import styles from './HeaderIcons.module.css';

export function HeaderIcons() {
  const { isOpen, openCart, closeCart, totalCount } = useCart();
  const { closeAuth } = useAuthModal();
  const { closeSearch } = useSearch();

  const handleClick = () => {
    if (isOpen) {
      closeCart();
      return;
    }
    closeAuth();
    closeSearch();
    openCart();
  };

  return (
    <button
      type="button"
      className={styles.cartBtn}
      aria-label={COPY.cart.cartAriaLabel(totalCount)}
      onClick={handleClick}
    >
      <Image
        src="/icons/card.png"
        alt=""
        width={20}
        height={20}
        className={`${styles.iconSm} ${styles.cartIcon}`}
      />
      {totalCount > 0 && <span className={styles.badge}>{totalCount}</span>}
    </button>
  );
}
