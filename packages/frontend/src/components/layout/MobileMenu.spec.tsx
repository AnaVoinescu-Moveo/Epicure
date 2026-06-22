import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MobileMenu } from './MobileMenu';
import { NAV_LINKS, FOOTER_LINKS } from '../../constants/nav';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('MobileMenu', () => {
  it('renders the hamburger button', () => {
    render(<MobileMenu navLinks={NAV_LINKS} footerLinks={FOOTER_LINKS} />);
    expect(
      screen.getByRole('button', { name: /open navigation menu/i }),
    ).toBeInTheDocument();
  });

  it('menu panel is not visible initially', () => {
    render(<MobileMenu navLinks={NAV_LINKS} footerLinks={FOOTER_LINKS} />);
    expect(
      screen.queryByRole('dialog', { name: /navigation menu/i }),
    ).not.toBeInTheDocument();
  });

  it('opens menu when hamburger is clicked', () => {
    render(<MobileMenu navLinks={NAV_LINKS} footerLinks={FOOTER_LINKS} />);
    fireEvent.click(
      screen.getByRole('button', { name: /open navigation menu/i }),
    );
    expect(
      screen.getByRole('dialog', { name: /navigation menu/i }),
    ).toBeInTheDocument();
  });

  it('closes menu when X button is clicked', () => {
    render(<MobileMenu navLinks={NAV_LINKS} footerLinks={FOOTER_LINKS} />);
    fireEvent.click(
      screen.getByRole('button', { name: /open navigation menu/i }),
    );
    fireEvent.click(
      screen.getByRole('button', { name: /close navigation menu/i }),
    );
    expect(
      screen.queryByRole('dialog', { name: /navigation menu/i }),
    ).not.toBeInTheDocument();
  });

  it('closes menu when Escape key is pressed', () => {
    render(<MobileMenu navLinks={NAV_LINKS} footerLinks={FOOTER_LINKS} />);
    fireEvent.click(
      screen.getByRole('button', { name: /open navigation menu/i }),
    );
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });
    expect(
      screen.queryByRole('dialog', { name: /navigation menu/i }),
    ).not.toBeInTheDocument();
  });

  it('locks body scroll when menu is open', () => {
    render(<MobileMenu navLinks={NAV_LINKS} footerLinks={FOOTER_LINKS} />);
    fireEvent.click(
      screen.getByRole('button', { name: /open navigation menu/i }),
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when menu is closed', () => {
    render(<MobileMenu navLinks={NAV_LINKS} footerLinks={FOOTER_LINKS} />);
    fireEvent.click(
      screen.getByRole('button', { name: /open navigation menu/i }),
    );
    fireEvent.click(
      screen.getByRole('button', { name: /close navigation menu/i }),
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('dialog has accessible name', () => {
    render(<MobileMenu navLinks={NAV_LINKS} footerLinks={FOOTER_LINKS} />);
    fireEvent.click(
      screen.getByRole('button', { name: /open navigation menu/i }),
    );
    expect(
      screen.getByRole('dialog', { name: 'Navigation menu' }),
    ).toBeInTheDocument();
  });

  it('shows Restaurants and Chefs nav links', () => {
    render(<MobileMenu navLinks={NAV_LINKS} footerLinks={FOOTER_LINKS} />);
    fireEvent.click(
      screen.getByRole('button', { name: /open navigation menu/i }),
    );
    expect(
      screen.getByRole('link', { name: 'Restaurants' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Chefs' })).toBeInTheDocument();
  });
});
