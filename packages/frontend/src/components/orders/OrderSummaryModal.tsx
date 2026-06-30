'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import type { Order, OrderItem } from '@org/shared-types';
import type { Dish } from '@/lib/strapi';
import { strapiUrl } from '@/lib/strapi';
import { COPY } from '@/constants/copy';
import { useCart } from '@/context/CartContext';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { getDishByDocumentId } from '@/services/dishService';
import styles from './OrderSummaryModal.module.css';

interface ResolvedItem {
  orderItem: OrderItem;
  dish: Dish | null;
}

function lineDescription(item: OrderItem) {
  const parts: string[] = [];
  if (item.side) parts.push(item.side);
  if (item.changes?.length) parts.push(item.changes.join(', '));
  return parts.join(' | ');
}

interface OrderSummaryModalProps {
  order: Order;
  onClose: () => void;
}

export function OrderSummaryModal({ order, onClose }: OrderSummaryModalProps) {
  const { addItem } = useCart();
  const [resolvedItems, setResolvedItems] = useState<ResolvedItem[] | null>(
    null,
  );
  const [isReordering, setIsReordering] = useState(false);
  const [unavailableNames, setUnavailableNames] = useState<string[]>([]);

  useEscapeKey(onClose, true);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      order.items.map(async (item) => ({
        orderItem: item,
        dish: await getDishByDocumentId(item.dishId),
      })),
    ).then((results) => {
      if (!cancelled) setResolvedItems(results);
    });
    return () => {
      cancelled = true;
    };
  }, [order]);

  const handleOrderAgain = () => {
    if (!resolvedItems || isReordering) return;
    setIsReordering(true);
    const unavailable: string[] = [];
    for (const { orderItem, dish } of resolvedItems) {
      if (!dish) {
        unavailable.push(orderItem.dishName);
        continue;
      }
      addItem(
        dish,
        orderItem.side ?? null,
        orderItem.changes ?? [],
        orderItem.quantity,
      );
    }
    setIsReordering(false);
    if (unavailable.length > 0) {
      setUnavailableNames(unavailable);
    } else {
      onClose();
    }
  };

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={COPY.orderHistory.summaryTitle}
      >
        <button
          type="button"
          className={styles.closeBtn}
          aria-label={COPY.orderHistory.closeAriaLabel}
          onClick={onClose}
        >
          <Image src="/icons/whiteX.svg" alt="" width={24} height={24} />
        </button>

        <h2 className={styles.title}>{COPY.orderHistory.summaryTitle}</h2>
        <p className={styles.restaurantName}>{order.restaurantName}</p>

        <div className={styles.dishList}>
          {order.items.map((item, index) => {
            const description = lineDescription(item);
            const dish = resolvedItems?.[index]?.dish;
            const imageUrl = dish?.image ? strapiUrl(dish.image.url) : null;
            return (
              <div key={`${item.dishId}-${index}`} className={styles.dishRow}>
                <div className={styles.imageWrapper}>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={dish?.image?.alternativeText ?? item.dishName}
                      fill
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder} />
                  )}
                </div>
                <div className={styles.dishInfo}>
                  <div className={styles.topRow}>
                    <div className={styles.quantityBox}>{item.quantity}</div>
                    <div className={styles.namePrice}>
                      <p className={styles.dishName}>{item.dishName}</p>
                      <p className={styles.unitPrice}>
                        {COPY.cart.unitPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  {description && (
                    <p className={styles.optionsRow}>{description}</p>
                  )}
                </div>
                <p className={styles.totalPrice}>
                  {COPY.cart.unitPrice(item.price * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>

        <div className={styles.commentSection}>
          <div className={styles.commentDivider} />
          <p className={styles.commentTitle}>{COPY.cart.addCommentTitle}</p>
          <textarea
            className={styles.commentTextarea}
            placeholder={COPY.cart.commentPlaceholder}
            value={order.comment ?? ''}
            readOnly
          />
        </div>

        {unavailableNames.length > 0 && (
          <p className={styles.notice}>
            {COPY.orderHistory.itemUnavailableNotice(unavailableNames)}
          </p>
        )}

        <button
          type="button"
          className={styles.orderAgainBtn}
          disabled={!resolvedItems || isReordering}
          onClick={handleOrderAgain}
        >
          {COPY.orderHistory.orderAgainLabel}
        </button>
      </div>
    </>,
    document.body,
  );
}
