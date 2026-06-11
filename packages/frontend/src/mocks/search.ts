import { SearchResultGroup } from '../components/search/SearchInput';

export const MOCK_SEARCH_DATA: SearchResultGroup[] = [
  {
    label: 'Restaurants',
    items: [
      {
        type: 'restaurant',
        name: 'Tiger Lily',
        href: '/restaurants/tiger-lily',
      },
      {
        type: 'restaurant',
        name: 'The Blue Door',
        href: '/restaurants/blue-door',
      },
      { type: 'restaurant', name: 'Taizu', href: '/restaurants/taizu' },
    ],
  },
  {
    label: 'Cuisine',
    items: [
      { type: 'dish', name: 'Thai', href: '/restaurants?cuisine=thai' },
      { type: 'dish', name: 'Italian', href: '/restaurants?cuisine=italian' },
      { type: 'dish', name: 'Japanese', href: '/restaurants?cuisine=japanese' },
    ],
  },
  {
    label: 'Chef',
    items: [
      { type: 'chef', name: 'Tom Aviv', href: '/chefs/tom-aviv' },
      { type: 'chef', name: 'Tomer Agay', href: '/chefs/tomer-agay' },
    ],
  },
];

export function mockSearch(query: string): SearchResultGroup[] {
  const q = query.toLowerCase();
  return MOCK_SEARCH_DATA.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.name.toLowerCase().startsWith(q),
    ),
  })).filter((group) => group.items.length > 0);
}
