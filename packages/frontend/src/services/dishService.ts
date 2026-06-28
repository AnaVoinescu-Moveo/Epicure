import { unstable_cache } from 'next/cache';
import { strapiGet, type Dish, type StrapiListResponse } from '@/lib/strapi';

export const getSignatureDishes = unstable_cache(
  async (): Promise<Dish[]> => {
    const data = await strapiGet<StrapiListResponse<Dish>>(
      '/dishes?filters[isSignature][$eq]=true&pagination[limit]=3&populate[image]=true&populate[restaurant]=true',
    );
    return data.data ?? [];
  },
  ['signature-dishes'],
  { revalidate: 60 },
);
