'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { OrderItem } from '@org/shared-types';
import { apiPost } from '@/lib/api';
import {
  strapiGet,
  type Restaurant,
  type StrapiSingleResponse,
} from '@/lib/strapi';
import { getUserLocation, haversineKm } from '@/lib/distance';
import { useAuthModal } from './AuthModalContext';

export interface ActiveOrder {
  orderId: number;
  items: OrderItem[];
  total: number;
  deliveryEndTime: number;
}

interface OrderResponse {
  id: number;
  items: OrderItem[];
  total: number;
}

interface PlaceOrderPayload {
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  comment?: string;
}

interface OrderConfirmationContextValue {
  activeOrders: ActiveOrder[];
  openOrder: ActiveOrder | null;
  remainingSecondsByOrderId: Record<number, number>;
  placeOrder: (payload: PlaceOrderPayload) => Promise<void>;
  closeModal: () => void;
  reopenModal: (orderId: number) => void;
}

const OrderConfirmationContext =
  createContext<OrderConfirmationContextValue | null>(null);

function storageKey(userEmail: string) {
  return `epicure_active_orders:${userEmail}`;
}

function loadActiveOrders(userEmail: string): ActiveOrder[] {
  try {
    const raw = localStorage.getItem(storageKey(userEmail));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ActiveOrder[];
    // Drop anything that finished delivering while we were away.
    return parsed.filter((order) => order.deliveryEndTime > Date.now());
  } catch {
    return [];
  }
}

function saveActiveOrders(userEmail: string, orders: ActiveOrder[]) {
  try {
    localStorage.setItem(storageKey(userEmail), JSON.stringify(orders));
  } catch {
    // Storage may be unavailable (e.g. Safari private mode) — in-memory
    // state still works for the rest of this session.
  }
}

function randomDeliveryMinutes() {
  return 30 + Math.random() * 90;
}

async function estimateDeliveryMinutes(restaurantId: string): Promise<number> {
  try {
    const [restaurantRes, userCoords] = await Promise.all([
      strapiGet<StrapiSingleResponse<Restaurant>>(
        `/restaurants/${restaurantId}`,
      ),
      getUserLocation(),
    ]);
    const restaurant = restaurantRes.data;
    if (!restaurant?.latitude || !restaurant?.longitude) {
      return randomDeliveryMinutes();
    }
    const distanceKm = haversineKm(
      userCoords.latitude,
      userCoords.longitude,
      restaurant.latitude,
      restaurant.longitude,
    );
    return Math.max(30, Math.ceil(distanceKm) * 30);
  } catch {
    return randomDeliveryMinutes();
  }
}

export function OrderConfirmationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userEmail } = useAuthModal();
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  const [remainingSecondsByOrderId, setRemainingSecondsByOrderId] = useState<
    Record<number, number>
  >({});
  const activeOrdersRef = useRef(activeOrders);
  activeOrdersRef.current = activeOrders;
  const userEmailRef = useRef(userEmail);
  userEmailRef.current = userEmail;

  // Active orders are tied to whichever account placed them, so a different
  // user logging in on the same browser never sees someone else's orders —
  // but the same user logging back out and in again does.
  useEffect(() => {
    if (!userEmail) {
      setActiveOrders([]);
      setOpenOrderId(null);
      return;
    }
    setActiveOrders(loadActiveOrders(userEmail));
  }, [userEmail]);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const seconds: Record<number, number> = {};
      let expired = false;
      for (const order of activeOrdersRef.current) {
        const secondsLeft = Math.max(
          0,
          Math.round((order.deliveryEndTime - now) / 1000),
        );
        seconds[order.orderId] = secondsLeft;
        if (secondsLeft === 0) expired = true;
      }
      setRemainingSecondsByOrderId(seconds);
      if (expired) {
        setActiveOrders((prev) => {
          const next = prev.filter((order) => order.deliveryEndTime > now);
          if (userEmailRef.current)
            saveActiveOrders(userEmailRef.current, next);
          return next;
        });
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Orders are persisted explicitly at the two points they actually change
  // (here and in the expiry-filter above), rather than via a generic
  // "save whenever activeOrders changes" effect — that approach raced
  // against the load effect above: on the render where userEmail first
  // becomes available, the load effect's setActiveOrders hasn't committed
  // yet, so a generic save-on-change effect would write the still-empty
  // initial state and clobber whatever was already in storage.
  const placeOrder = useCallback(async (payload: PlaceOrderPayload) => {
    // The delivery estimate only needs the restaurant id from the payload,
    // not the order that's about to be created, so run it alongside the
    // order-creation request instead of waiting on it first.
    const [order, minutes] = await Promise.all([
      apiPost<OrderResponse>('/orders', payload),
      estimateDeliveryMinutes(payload.restaurantId),
    ]);
    const newOrder: ActiveOrder = {
      orderId: order.id,
      items: order.items,
      total: order.total,
      deliveryEndTime: Date.now() + minutes * 60_000,
    };
    setActiveOrders((prev) => {
      const next = [...prev, newOrder];
      if (userEmailRef.current) saveActiveOrders(userEmailRef.current, next);
      return next;
    });
    setOpenOrderId(newOrder.orderId);
  }, []);

  const closeModal = useCallback(() => setOpenOrderId(null), []);
  const reopenModal = useCallback(
    (orderId: number) => setOpenOrderId(orderId),
    [],
  );

  const openOrder =
    activeOrders.find((order) => order.orderId === openOrderId) ?? null;

  return (
    <OrderConfirmationContext.Provider
      value={{
        activeOrders,
        openOrder,
        remainingSecondsByOrderId,
        placeOrder,
        closeModal,
        reopenModal,
      }}
    >
      {children}
    </OrderConfirmationContext.Provider>
  );
}

export function useOrderConfirmation() {
  const ctx = useContext(OrderConfirmationContext);
  if (!ctx) {
    throw new Error(
      'useOrderConfirmation must be used within an OrderConfirmationProvider',
    );
  }
  return ctx;
}
