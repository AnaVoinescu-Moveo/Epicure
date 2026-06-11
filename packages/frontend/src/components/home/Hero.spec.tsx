import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Hero } from './Hero';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe('Hero', () => {
  it('renders the hero image', () => {
    render(<Hero />);
    expect(screen.getByAltText('Epicure restaurant scene')).toBeInTheDocument();
  });

  it('renders the heading text', () => {
    render(<Hero />);
    expect(screen.getByText(/Epicure works with the top/i)).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<Hero />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('does not show dropdown before typing', () => {
    render(<Hero />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows categorised results when typing a matching query', () => {
    render(<Hero />);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'T' },
    });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Tiger Lily')).toBeInTheDocument();
    expect(screen.getByText('Restaurants')).toBeInTheDocument();
    expect(screen.getByText('Thai')).toBeInTheDocument();
    expect(screen.getByText('Cuisine')).toBeInTheDocument();
  });

  it('shows no dropdown when query matches nothing', () => {
    render(<Hero />);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'zzz' },
    });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
