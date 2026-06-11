export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/restaurants', label: 'Restaurants' },
  { href: '/chefs', label: 'Chefs' },
];
