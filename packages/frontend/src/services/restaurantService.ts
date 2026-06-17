import { unstable_cache } from 'next/cache';
import {
  strapiGet,
  type Restaurant,
  type StrapiListResponse,
} from '@/lib/strapi';

export const getPopularRestaurants = unstable_cache(
  async (): Promise<Restaurant[]> => {
    const data = await strapiGet<StrapiListResponse<Restaurant>>(
      '/restaurants?sort=rating:desc&pagination[limit]=3&populate[chef]=true&populate[image]=true',
    );
    return data.data ?? [];
  },
  ['popular-restaurants'],
  { revalidate: 60 },
);

export const getAllRestaurants = unstable_cache(
  async (): Promise<Restaurant[]> => {
    const data = await strapiGet<StrapiListResponse<Restaurant>>(
      '/restaurants?sort=rating:desc&pagination[limit]=100&populate[chef]=true&populate[image]=true&populate[dishes]=true',
    );
    return data.data ?? [];
  },
  ['all-restaurants'],
  { revalidate: 60 },
);
