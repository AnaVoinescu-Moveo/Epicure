'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuthModal } from '@/context/AuthModalContext';
import { CheckoutPage } from '@/components/checkout/CheckoutPage';

export default function Checkout() {
  const router = useRouter();
  const { items } = useCart();
  const { isAuthenticated, isAuthReady } = useAuthModal();

  useEffect(() => {
    // Wait for the token to load from localStorage before deciding the user
    // is a guest — otherwise a refresh/direct nav bounces logged-in users.
    if (!isAuthReady) return;
    if (!isAuthenticated || items.length === 0) {
      router.replace('/');
    }
  }, [isAuthReady, isAuthenticated, items.length, router]);

  if (!isAuthReady || !isAuthenticated || items.length === 0) return null;

  return <CheckoutPage />;
}
