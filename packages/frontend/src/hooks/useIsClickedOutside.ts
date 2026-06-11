import { useEffect, RefObject } from 'react';

export function useIsClickedOutside(
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [ref, callback, active]);
}
