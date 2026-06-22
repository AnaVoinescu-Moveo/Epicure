import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavLinks } from './NavLinks';
import {
  RestaurantsFilterProvider,
  useRestaurantsFilter,
} from '../../context/RestaurantsFilterContext';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) => (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}));

const mockUsePathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

function renderNavLinks() {
  return render(
    <RestaurantsFilterProvider>
      <NavLinks />
    </RestaurantsFilterProvider>,
  );
}

describe('NavLinks', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  it('renders Restaurants and Chefs links', () => {
    renderNavLinks();
    expect(
      screen.getByRole('link', { name: 'Restaurants' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Chefs' })).toBeInTheDocument();
  });

  it('links point to correct routes', () => {
    renderNavLinks();
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
    renderNavLinks();
    const link = screen.getByRole('link', { name: 'Restaurants' });
    expect(link.className).toContain('active');
  });

  it('applies active class to Chefs link when on /chefs', () => {
    mockUsePathname.mockReturnValue('/chefs');
    renderNavLinks();
    const link = screen.getByRole('link', { name: 'Chefs' });
    expect(link.className).toContain('active');
  });

  it('does not apply active class when on a different route', () => {
    mockUsePathname.mockReturnValue('/');
    renderNavLinks();
    expect(
      screen.getByRole('link', { name: 'Restaurants' }).className,
    ).not.toContain('active');
    expect(screen.getByRole('link', { name: 'Chefs' }).className).not.toContain(
      'active',
    );
  });

  it('applies active class to Restaurants link when on a locale-prefixed /en/restaurants path', () => {
    mockUsePathname.mockReturnValue('/en/restaurants');
    renderNavLinks();
    const link = screen.getByRole('link', { name: 'Restaurants' });
    expect(link.className).toContain('active');
  });

  it('applies active class to Chefs link when on a locale-prefixed /he/chefs path', () => {
    mockUsePathname.mockReturnValue('/he/chefs');
    renderNavLinks();
    const link = screen.getByRole('link', { name: 'Chefs' });
    expect(link.className).toContain('active');
  });

  it('triggers a filter reset when clicking Restaurants while already on /restaurants', () => {
    mockUsePathname.mockReturnValue('/restaurants');

    let observedResetSignal = -1;
    function ResetSignalProbe() {
      observedResetSignal = useRestaurantsFilter().resetSignal;
      return null;
    }

    render(
      <RestaurantsFilterProvider>
        <NavLinks />
        <ResetSignalProbe />
      </RestaurantsFilterProvider>,
    );

    const before = observedResetSignal;
    fireEvent.click(screen.getByRole('link', { name: 'Restaurants' }));
    expect(observedResetSignal).toBe(before + 1);
  });

  it('does not trigger a filter reset when clicking a link on a different route', () => {
    mockUsePathname.mockReturnValue('/');

    let observedResetSignal = -1;
    function ResetSignalProbe() {
      observedResetSignal = useRestaurantsFilter().resetSignal;
      return null;
    }

    render(
      <RestaurantsFilterProvider>
        <NavLinks />
        <ResetSignalProbe />
      </RestaurantsFilterProvider>,
    );

    const before = observedResetSignal;
    fireEvent.click(screen.getByRole('link', { name: 'Restaurants' }));
    expect(observedResetSignal).toBe(before);
  });
});
