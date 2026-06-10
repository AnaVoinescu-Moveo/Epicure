import React from 'react';
import { render, screen } from '@testing-library/react';
import { NavLinks } from './NavLinks';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const mockUsePathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('NavLinks', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  it('renders Restaurants and Chefs links', () => {
    render(<NavLinks />);
    expect(
      screen.getByRole('link', { name: 'Restaurants' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Chefs' })).toBeInTheDocument();
  });

  it('links point to correct routes', () => {
    render(<NavLinks />);
    expect(screen.getByRole('link', { name: 'Restaurants' })).toHaveAttribute(
      'href',
      '/restaurants',
    );
    expect(screen.getByRole('link', { name: 'Chefs' })).toHaveAttribute(
      'href',
      '/chefs',
    );
  });

  it('applies active class to Restaurants link when on /restaurants', () => {
    mockUsePathname.mockReturnValue('/restaurants');
    render(<NavLinks />);
    const link = screen.getByRole('link', { name: 'Restaurants' });
    expect(link.className).toContain('active');
  });

  it('applies active class to Chefs link when on /chefs', () => {
    mockUsePathname.mockReturnValue('/chefs');
    render(<NavLinks />);
    const link = screen.getByRole('link', { name: 'Chefs' });
    expect(link.className).toContain('active');
  });

  it('does not apply active class when on a different route', () => {
    mockUsePathname.mockReturnValue('/');
    render(<NavLinks />);
    expect(
      screen.getByRole('link', { name: 'Restaurants' }).className,
    ).not.toContain('active');
    expect(screen.getByRole('link', { name: 'Chefs' }).className).not.toContain(
      'active',
    );
  });
});
