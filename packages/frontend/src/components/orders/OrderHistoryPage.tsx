'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Order } from '@org/shared-types';
import { COPY } from '@/constants/copy';
import { apiGet } from '@/lib/api';
import { formatOrderDate } from '@/lib/time';
import { OrderSummaryModal } from './OrderSummaryModal';
import styles from './OrderHistoryPage.module.css';

export function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    apiGet<Order[]>('/orders/history')
      .then(setOrders)
      .catch(() => setError(COPY.orderHistory.genericError));
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{COPY.orderHistory.pageTitle}</h1>

      {error && <p className={styles.error}>{error}</p>}

      {!error && orders.length === 0 && (
        <p className={styles.empty}>{COPY.orderHistory.emptyMessage}</p>
      )}

      <ul className={styles.list}>
        {orders.map((order) => (
          <li key={order.id} className={styles.row}>
            <span className={styles.restaurantName}>
              {order.restaurantName}
            </span>
            <span className={styles.date}>
              {formatOrderDate(order.createdAt)}
            </span>
            <span className={styles.priceGroup}>
              <span className={styles.price}>
                {COPY.dishDetail.shekelSign}
                {order.total}
              </span>
              <button
                type="button"
                className={styles.arrowBtn}
                aria-label={COPY.orderHistory.rowArrowAlt}
                onClick={() => setSelectedOrder(order)}
              >
                <Image
                  src="/icons/Erow.svg"
                  alt=""
                  width={24}
                  height={18}
                />
              </button>
            </span>
          </li>
        ))}
      </ul>

      {selectedOrder && (
        <OrderSummaryModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
