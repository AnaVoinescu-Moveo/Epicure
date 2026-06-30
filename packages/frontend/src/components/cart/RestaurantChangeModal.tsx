'use client';

import Image from 'next/image';
import { COPY } from '@/constants/copy';
import { useCart } from '@/context/CartContext';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import styles from './RestaurantChangeModal.module.css';

export function RestaurantChangeModal() {
  const {
    pendingRestaurantSwitch,
    confirmRestaurantSwitch,
    cancelRestaurantSwitch,
  } = useCart();

  useEscapeKey(cancelRestaurantSwitch, pendingRestaurantSwitch !== null);

  if (!pendingRestaurantSwitch) return null;

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={cancelRestaurantSwitch}
        aria-hidden="true"
      />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={COPY.restaurantSwitch.title}
      >
        <button
          type="button"
          className={styles.closeBtn}
          aria-label={COPY.restaurantSwitch.closeAriaLabel}
          onClick={cancelRestaurantSwitch}
        >
          <Image src="/icons/whiteX.svg" alt="" width={18} height={18} />
        </button>

        <div className={styles.questionIcon} aria-hidden="true">
          ?
        </div>

        <h2 className={styles.title}>{COPY.restaurantSwitch.title}</h2>
        <p className={styles.description}>
          {COPY.restaurantSwitch.description}
        </p>

        <button
          type="button"
          className={styles.deleteBtn}
          onClick={confirmRestaurantSwitch}
        >
          {COPY.restaurantSwitch.deleteLabel}
        </button>
        <button
          type="button"
          className={styles.backBtn}
          onClick={cancelRestaurantSwitch}
        >
          {COPY.restaurantSwitch.backToOrderLabel}
        </button>
      </div>
    </>
  );
}
