'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { Dish } from '@/lib/strapi';

interface DishModalContextValue {
  selectedDish: Dish | null;
  openDish: (dish: Dish) => void;
  closeDish: () => void;
}

const DishModalContext = createContext<DishModalContextValue | null>(null);

export function DishModalProvider({ children }: { children: React.ReactNode }) {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const openDish = useCallback((dish: Dish) => setSelectedDish(dish), []);
  const closeDish = useCallback(() => setSelectedDish(null), []);

  return (
    <DishModalContext.Provider value={{ selectedDish, openDish, closeDish }}>
      {children}
    </DishModalContext.Provider>
  );
}

export function useDishModal() {
  const ctx = useContext(DishModalContext);
  if (!ctx) {
    throw new Error('useDishModal must be used within a DishModalProvider');
  }
  return ctx;
}
