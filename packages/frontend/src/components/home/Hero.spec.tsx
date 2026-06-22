import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroSearch } from './HeroSearch';
import type { Chef, Restaurant } from '../../lib/strapi';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    documentId: 'r1',
    name: 'Tiger Lily',
    image: null,
    rating: 4.5,
    chef: null,
    priceRange: null,
    distance: null,
    isNew: false,
    openingTime: null,
    closingTime: null,
    latitude: null,
    longitude: null,
    cuisine: 'asian',
  },
];

const mockChefs: Chef[] = [
  {
    id: 1,
    documentId: 'c1',
    name: 'Tom Aviv',
    description: null,
    image: null,
    isChefOfTheWeek: false,
    restaurants: [],
  },
];

describe('HeroSearch', () => {
  it('renders the search input', () => {
    render(<HeroSearch restaurants={mockRestaurants} chefs={mockChefs} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('does not show dropdown before typing', () => {
    render(<HeroSearch restaurants={mockRestaurants} chefs={mockChefs} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows categorised results when typing a matching query', () => {
    render(<HeroSearch restaurants={mockRestaurants} chefs={mockChefs} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'T' } });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Tiger Lily')).toBeInTheDocument();
    expect(screen.getByText('Thai')).toBeInTheDocument();
    expect(screen.getByText('Tom Aviv')).toBeInTheDocument();
  });

  it('shows no dropdown when query matches nothing', () => {
    render(<HeroSearch restaurants={mockRestaurants} chefs={mockChefs} />);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'zzz' },
    });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
