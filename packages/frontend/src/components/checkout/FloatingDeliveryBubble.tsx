'use client';

import { COPY } from '@/constants/copy';
import { useOrderConfirmation } from '@/context/OrderConfirmationContext';
import { formatMMSS } from '@/lib/time';
import styles from './FloatingDeliveryBubble.module.css';

export function FloatingDeliveryBubble() {
  const { activeOrders, openOrder, remainingSecondsByOrderId, reopenModal } =
    useOrderConfirmation();

  // Excludes the order currently shown in the modal, and anything that has
  // already hit 0 but hasn't been pruned from activeOrders by the next tick
  // yet — without this, closing the modal right as the timer ends could
  // flash a "00:00" bubble for up to a second before it's removed.
  const visibleOrders = activeOrders.filter(
    (order) =>
      order.orderId !== openOrder?.orderId &&
      (remainingSecondsByOrderId[order.orderId] ?? 0) > 0,
  );

  return (
    <>
      {visibleOrders.map((order, index) => (
        <button
          key={order.orderId}
          type="button"
          className={styles.bubble}
          style={{ bottom: 90 + index * 64 }}
          aria-label={COPY.orderConfirmation.bubbleAriaLabel}
          onClick={() => reopenModal(order.orderId)}
        >
          {formatMMSS(remainingSecondsByOrderId[order.orderId] ?? 0)}
        </button>
      ))}
    </>
  );
}
