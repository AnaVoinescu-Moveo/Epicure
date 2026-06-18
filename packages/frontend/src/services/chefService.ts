import { unstable_cache } from 'next/cache';
import { strapiGet, type Chef, type StrapiListResponse } from '@/lib/strapi';

export const getAllChefs = unstable_cache(
  async (): Promise<Chef[]> => {
    const data = await strapiGet<StrapiListResponse<Chef>>(
      '/chefs?pagination[limit]=100&populate[image]=true&sort=name:asc',
    );
    return data.data ?? [];
  },
  ['all-chefs'],
  { revalidate: 60 },
);

export const getChefOfTheWeek = unstable_cache(
  async (): Promise<Chef | null> => {
    const data = await strapiGet<StrapiListResponse<Chef>>(
      '/chefs?filters[isChefOfTheWeek][$eq]=true&pagination[limit]=1&populate[image]=true&populate[restaurants][populate][image]=true',
    );
    return data.data?.[0] ?? null;
  },
  ['chef-of-the-week'],
  { revalidate: 60 },
);
