import { CUISINES, type Chef, type Restaurant } from './strapi';
import type { SearchResultGroup } from '@/components/search/SearchInput';

export { CUISINES };

export function buildSearchFn(restaurants: Restaurant[], chefs: Chef[]) {
  return (query: string): SearchResultGroup[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const restaurantItems = restaurants
      .filter((r) => r.name.toLowerCase().startsWith(q))
      .map((r) => ({
        type: 'restaurant' as const,
        name: r.name,
        href: `/restaurants/${r.documentId}`,
      }));

    const chefItems = chefs
      .filter((c) => c.name.toLowerCase().startsWith(q))
      .map((c) => ({
        type: 'chef' as const,
        name: c.name,
        href: `/chefs/${c.documentId}`,
      }));

    const cuisineItems = CUISINES.filter((c) =>
      c.label.toLowerCase().startsWith(q),
    ).map((c) => ({
      type: 'cuisine' as const,
      name: c.label,
      href: `/cuisine/${c.slug}`,
    }));

    return [
      { label: 'Restaurants', items: restaurantItems },
      { label: 'Chef', items: chefItems },
      { label: 'Cuisine', items: cuisineItems },
    ].filter((g) => g.items.length > 0);
  };
}
