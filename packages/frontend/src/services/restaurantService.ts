import { unstable_cache } from 'next/cache';
import {
  strapiGet,
  type Restaurant,
  type StrapiListResponse,
  type StrapiSingleResponse,
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
      '/restaurants?sort=rating:desc&pagination[limit]=100&populate[chef]=true&populate[image]=true',
    );
    return data.data ?? [];
  },
  ['all-restaurants'],
  { revalidate: 60 },
);

export const getRestaurantByDocumentId = unstable_cache(
  async (documentId: string): Promise<Restaurant | null> => {
    try {
      const data = await strapiGet<StrapiSingleResponse<Restaurant>>(
        `/restaurants/${documentId}?populate[chef]=true&populate[image]=true&populate[dishes][populate]=*`,
      );
      return data.data ?? null;
    } catch {
      return null;
    }
  },
  ['restaurant'],
  { revalidate: 60 },
);
