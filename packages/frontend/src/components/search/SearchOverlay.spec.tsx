import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SearchOverlay } from './SearchOverlay';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe('SearchOverlay', () => {
  it('renders with dialog role and accessible name', () => {
    render(<SearchOverlay onClose={jest.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders the Search title', () => {
    render(<SearchOverlay onClose={jest.fn()} />);
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('renders the close button', () => {
    render(<SearchOverlay onClose={jest.fn()} />);
    expect(
      screen.getByRole('button', { name: /close search/i }),
    ).toBeInTheDocument();
  });

  it('calls onClose when X button is clicked', () => {
    const onClose = jest.fn();
    render(<SearchOverlay onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close search/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = jest.fn();
    render(<SearchOverlay onClose={onClose} />);
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll on mount', () => {
    render(<SearchOverlay onClose={jest.fn()} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll on unmount', () => {
    const { unmount } = render(<SearchOverlay onClose={jest.fn()} />);
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('renders the search input', () => {
    render(<SearchOverlay onClose={jest.fn()} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
});
