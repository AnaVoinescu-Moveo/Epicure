import { unstable_cache } from 'next/cache';
import {
  strapiGet,
  type StrapiSingleResponse,
  type StrapiFooter,
} from '@/lib/strapi';

export const getFooter = unstable_cache(
  async (): Promise<StrapiFooter | null> => {
    try {
      const data = await strapiGet<StrapiSingleResponse<StrapiFooter>>(
        '/footer?populate[footerLinks]=true',
      );
      return data.data ?? null;
    } catch {
      return null;
    }
  },
  ['footer'],
  { revalidate: 60 },
);
