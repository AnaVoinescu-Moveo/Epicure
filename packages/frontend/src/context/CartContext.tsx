'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Dish } from '@/lib/strapi';

export interface CartItem {
  id: string;
  dish: Dish;
  side: string | null;
  changes: string[];
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (
    dish: Dish,
    side: string | null,
    changes: string[],
    quantity: number,
  ) => void;
  totalCount: number;
  totalPrice: number;
  comment: string;
  setComment: (text: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function lineId(dish: Dish, side: string | null, changes: string[]) {
  return [dish.documentId, side ?? '', [...changes].sort().join(',')].join(
    '::',
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState('');
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (dish: Dish, side: string | null, changes: string[], quantity: number) => {
      const currentItems = itemsRef.current;
      const currentRestaurantId = currentItems[0]?.dish.restaurant?.documentId;
      const newRestaurantId = dish.restaurant?.documentId;
      const isDifferentRestaurant =
        currentItems.length > 0 && currentRestaurantId !== newRestaurantId;

      if (isDifferentRestaurant) {
        const confirmed = window.confirm(
          `Adding this dish will clear your current order from ${
            currentItems[0].dish.restaurant?.name ?? 'this restaurant'
          }. Continue?`,
        );
        if (!confirmed) return;
        setComment('');
        setItems([
          { id: lineId(dish, side, changes), dish, side, changes, quantity },
        ]);
        setIsOpen(true);
        return;
      }

      const id = lineId(dish, side, changes);
      setItems((prev) => {
        const existing = prev.find((item) => item.id === id);
        if (existing) {
          return prev.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [...prev, { id, dish, side, changes, quantity }];
      });
      setIsOpen(true);
    },
    [],
  );

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        totalCount,
        totalPrice,
        comment,
        setComment,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
