import { useEffect } from 'react';

export function useScrollLock(active: boolean) {
  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);
}
