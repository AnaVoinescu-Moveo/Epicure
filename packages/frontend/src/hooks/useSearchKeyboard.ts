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
    } else if (e.key === 'Enter') {
      onSelect(activeIndex >= 0 ? activeIndex : 0);
    }
  };

  return { activeIndex, setActiveIndex, handleKeyDown };
}
