export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/restaurants', label: 'Restaurants' },
  { href: '/chefs', label: 'Chefs' },
];

// TODO: fetch footer links from Strapi once a FooterLink collection type is added to the CMS
export const FOOTER_LINKS: NavLink[] = [
  { href: '/contact', label: 'Contact Us' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/privacy', label: 'Privacy Policy' },
];
