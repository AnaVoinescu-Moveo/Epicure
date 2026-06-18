import { unstable_cache } from 'next/cache';
import { strapiGet, type StrapiSingleResponse, type StrapiHeader } from '@/lib/strapi';

export const getHeader = unstable_cache(
  async (): Promise<StrapiHeader | null> => {
    try {
      const data = await strapiGet<StrapiSingleResponse<StrapiHeader>>(
        '/header?populate[navLinks]=true',
      );
      return data.data ?? null;
    } catch {
      return null;
    }
  },
  ['header'],
  { revalidate: 60 },
);
