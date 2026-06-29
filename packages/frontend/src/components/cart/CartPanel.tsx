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

function lineDescription(item: CartItem) {
  const parts: string[] = [];
  if (item.side) parts.push(item.side);
  if (item.changes.length) parts.push(item.changes.join(', '));
  return parts.join(' | ');
}

function OrderHistoryButton() {
  return (
    <button type="button" className={styles.orderHistoryBtn}>
      {COPY.cart.orderHistoryLabel}
    </button>
  );
}

export function CartPanel() {
  const { items, isOpen, closeCart, totalPrice, comment, setComment } =
    useCart();
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
          <p className={styles.desktopEmptyMessage}>
            {COPY.cart.desktopEmptyLine1}
            <br />
            {COPY.cart.desktopEmptyLine2}
          </p>
          <div className={styles.desktopEmptyFooter}>
            <OrderHistoryButton />
          </div>
        </div>
      </>
    );
  }

  const restaurantName = items[0]?.dish.restaurant?.name ?? '';

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
        <h2 className={styles.desktopTitle}>{COPY.cart.desktopTitle}</h2>

        <div className={styles.scrollArea}>
          <p className={styles.restaurantName}>{restaurantName}</p>
          {items.map((item) => {
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
                      alt={item.dish.image?.alternativeText ?? item.dish.name}
                      fill
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder} />
                  )}
                </div>

                {/* Mobile content */}
                <div className={styles.dishInfo}>
                  <p className={styles.titleRow}>
                    <span className={styles.qtyX}>{item.quantity} x</span>{' '}
                    <span className={styles.dishName}>{item.dish.name}</span>
                  </p>
                  {description && (
                    <p className={styles.optionsRow}>{description}</p>
                  )}
                  <p className={styles.price}>
                    {COPY.dishDetail.shekelSign}
                    {item.dish.price * item.quantity}
                  </p>
                </div>

                {/* Desktop content */}
                <div className={styles.desktopDishInfo}>
                  <div className={styles.desktopTopRow}>
                    <div className={styles.desktopQuantityBox}>
                      {item.quantity}
                    </div>
                    <div className={styles.desktopNamePrice}>
                      <p className={styles.desktopDishName}>{item.dish.name}</p>
                      <p className={styles.desktopUnitPrice}>
                        {COPY.cart.unitPrice(item.dish.price)}
                      </p>
                    </div>
                  </div>
                  {description && (
                    <p className={styles.desktopOptionsRow}>{description}</p>
                  )}
                </div>
                <p className={styles.desktopTotalPrice}>
                  {COPY.cart.unitPrice(item.dish.price * item.quantity)}
                </p>
              </div>
            );
          })}

          <div className={styles.commentSection}>
            <div className={styles.commentDivider} />
            <p className={styles.commentTitle}>{COPY.cart.addCommentTitle}</p>
            <textarea
              className={styles.commentTextarea}
              placeholder={COPY.cart.commentPlaceholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
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

        <div className={styles.desktopFooter}>
          <button type="button" className={styles.desktopCheckoutBtn}>
            {COPY.cart.checkoutLabel(totalPrice)}
          </button>
          <OrderHistoryButton />
        </div>
      </div>
    </>
  );
}
