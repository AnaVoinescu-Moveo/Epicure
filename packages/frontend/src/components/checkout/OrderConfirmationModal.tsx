'use client';

import { COPY } from '@/constants/copy';
import { useOrderConfirmation } from '@/context/OrderConfirmationContext';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { formatMMSS } from '@/lib/time';
import styles from './OrderConfirmationModal.module.css';

function CheckmarkIcon() {
  return (
    <svg width="76" height="51" viewBox="0 0 76 51" fill="none">
      <path
        d="M4 27 L28 47 L72 4"
        stroke="#DE920080"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function OrderConfirmationModal() {
  const { openOrder, remainingSecondsByOrderId, closeModal } =
    useOrderConfirmation();

  useEscapeKey(closeModal, openOrder !== null);

  if (!openOrder) return null;
  const remainingSeconds = remainingSecondsByOrderId[openOrder.orderId] ?? 0;

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={closeModal}
        aria-hidden="true"
      />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={COPY.orderConfirmation.title}
      >
        <button
          type="button"
          className={styles.closeBtn}
          aria-label={COPY.orderConfirmation.closeAriaLabel}
          onClick={closeModal}
        >
          ×
        </button>

        <CheckmarkIcon />

        <h2 className={styles.title}>{COPY.orderConfirmation.title}</h2>
        <p className={styles.subtitle}>{COPY.orderConfirmation.subtitle}</p>

        <div className={styles.timerRow}>
          <span className={styles.timerLabel}>
            {COPY.orderConfirmation.arriveInLabel}
          </span>
          <span className={styles.timerValue}>
            {formatMMSS(remainingSeconds)}
          </span>
          <span className={styles.timerLabel}>
            {COPY.orderConfirmation.minLabel}
          </span>
        </div>

        <div className={styles.itemsList}>
          {openOrder.items.map((item, index) => (
            <p key={`${item.dishId}-${index}`} className={styles.itemRow}>
              <span className={styles.itemQty}>
                {item.quantity}× {item.dishName}
              </span>
              <span className={styles.itemPrice}>
                {COPY.dishDetail.shekelSign}
                {item.price * item.quantity}
              </span>
            </p>
          ))}
        </div>

        <p className={styles.totalRow}>
          {COPY.checkout.totalLabel(openOrder.total)}
        </p>
      </div>
    </>
  );
}
