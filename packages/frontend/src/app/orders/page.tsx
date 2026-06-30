'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/context/AuthModalContext';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { OrderHistoryPage } from '@/components/orders/OrderHistoryPage';

export default function Orders() {
  const router = useRouter();
  const { isAuthenticated, isAuthReady } = useAuthModal();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    // Wait for the token to load from localStorage before deciding the user
    // is a guest — otherwise a refresh/direct nav bounces logged-in users.
    if (!isAuthReady) return;
    if (!isAuthenticated || !isDesktop) {
      router.replace('/');
    }
  }, [isAuthReady, isAuthenticated, isDesktop, router]);

  if (!isAuthReady || !isAuthenticated || !isDesktop) return null;

  return <OrderHistoryPage />;
}
