'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface RestaurantsFilterContextValue {
  resetSignal: number;
  triggerReset: () => void;
}

const RestaurantsFilterContext =
  createContext<RestaurantsFilterContextValue | null>(null);

export function RestaurantsFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [resetSignal, setResetSignal] = useState(0);
  const triggerReset = useCallback(() => setResetSignal((n) => n + 1), []);

  return (
    <RestaurantsFilterContext.Provider value={{ resetSignal, triggerReset }}>
      {children}
    </RestaurantsFilterContext.Provider>
  );
}

export function useRestaurantsFilter() {
  const ctx = useContext(RestaurantsFilterContext);
  if (!ctx) {
    throw new Error(
      'useRestaurantsFilter must be used within a RestaurantsFilterProvider',
    );
  }
  return ctx;
}
