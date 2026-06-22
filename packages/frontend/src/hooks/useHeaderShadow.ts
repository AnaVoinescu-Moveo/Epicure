import { useEffect } from 'react';

export function useHeaderShadow() {
  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;
    const prev = header.style.boxShadow;
    header.style.boxShadow = '0px 2px 10px 0px rgba(0, 0, 0, 0.07)';
    return () => {
      header.style.boxShadow = prev;
    };
  }, []);
}
