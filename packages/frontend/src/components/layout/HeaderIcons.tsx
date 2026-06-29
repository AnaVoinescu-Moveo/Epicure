'use client';

import Image from 'next/image';
import { COPY } from '../../constants/copy';
import { useCart } from '../../context/CartContext';
import styles from './HeaderIcons.module.css';

export function HeaderIcons() {
  const { isOpen, openCart, closeCart, totalCount } = useCart();

  return (
    <button
      type="button"
      className={styles.cartBtn}
      aria-label={COPY.cart.cartAriaLabel(totalCount)}
      onClick={() => (isOpen ? closeCart() : openCart())}
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
