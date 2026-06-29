'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { strapiUrl } from '@/lib/strapi';
import { COPY } from '@/constants/copy';
import { useCart, type CartItem } from '@/context/CartContext';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import styles from './CartPanel.module.css';

function groupByRestaurant(items: CartItem[]) {
  const groups: { key: string; name: string; items: CartItem[] }[] = [];
  for (const item of items) {
    const key = item.dish.restaurant?.documentId ?? 'unknown';
    const name = item.dish.restaurant?.name ?? '';
    let group = groups.find((g) => g.key === key);
    if (!group) {
      group = { key, name, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}

function lineDescription(item: CartItem) {
  const parts: string[] = [];
  if (item.side) parts.push(item.side);
  if (item.changes.length) parts.push(item.changes.join(', '));
  return parts.join(' | ');
}

export function CartPanel() {
  const { items, isOpen, closeCart, totalPrice } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock(isOpen);
  useEscapeKey(closeCart, isOpen);
  useFocusTrap(panelRef, isOpen);

  if (!isOpen) return null;

  if (items.length === 0) {
    return (
      <>
        <div
          className={styles.backdrop}
          onClick={closeCart}
          aria-hidden="true"
        />
        <div
          ref={panelRef}
          className={styles.emptyPanel}
          role="dialog"
          aria-modal="true"
          aria-label={COPY.cart.title}
        >
          <Image
            src="/icons/bigCard.svg"
            alt=""
            width={49}
            height={49}
            className={styles.emptyIcon}
          />
          <p className={styles.emptyMessage}>
            {COPY.cart.emptyLine1}
            <br />
            {COPY.cart.emptyLine2}
          </p>
        </div>
      </>
    );
  }

  const groups = groupByRestaurant(items);

  return (
    <>
      <div className={styles.backdrop} onClick={closeCart} aria-hidden="true" />
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={COPY.cart.title}
      >
        <h2 className={styles.title}>{COPY.cart.title}</h2>

        <div className={styles.scrollArea}>
          {groups.map((group) => (
            <div key={group.key} className={styles.restaurantGroup}>
              <p className={styles.restaurantName}>{group.name}</p>
              {group.items.map((item) => {
                const description = lineDescription(item);
                const imageUrl = item.dish.image
                  ? strapiUrl(item.dish.image.url)
                  : null;
                return (
                  <div key={item.id} className={styles.dishCard}>
                    <div className={styles.imageWrapper}>
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={
                            item.dish.image?.alternativeText ?? item.dish.name
                          }
                          fill
                          className={styles.image}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder} />
                      )}
                    </div>
                    <div className={styles.dishInfo}>
                      <p className={styles.titleRow}>
                        <span className={styles.qtyX}>{item.quantity} x</span>{' '}
                        <span className={styles.dishName}>
                          {item.dish.name}
                        </span>
                      </p>
                      {description && (
                        <p className={styles.optionsRow}>{description}</p>
                      )}
                      <p className={styles.price}>
                        {COPY.dishDetail.shekelSign}
                        {item.dish.price * item.quantity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <p className={styles.totalRow}>
            {COPY.cart.totalLabel} - {COPY.dishDetail.shekelSign}
            {totalPrice}
          </p>
          <button type="button" className={styles.checkoutBtn}>
            <Image
              src="/images/checkout.png"
              alt={COPY.cart.checkoutAlt}
              width={206}
              height={48}
            />
          </button>
        </div>
      </div>
    </>
  );
}
