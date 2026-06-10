import { useState, KeyboardEvent } from 'react';

export function useSearchKeyboard(
  itemCount: number,
  onSelect: (index: number) => void,
) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!itemCount) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % itemCount);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? itemCount - 1 : i - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      onSelect(activeIndex);
    }
  };

  return { activeIndex, setActiveIndex, handleKeyDown };
}
