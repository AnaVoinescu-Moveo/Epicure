'use client';

import { usePathname } from 'next/navigation';
import { stripLocale } from '@/lib/locale';

const HIDDEN_ON = ['/checkout'];

export function HeaderVisibility({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(stripLocale(pathname))) return null;
  return <>{children}</>;
}
