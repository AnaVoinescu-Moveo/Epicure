import { unstable_cache } from 'next/cache';
import {
  strapiGet,
  type Dish,
  type StrapiListResponse,
  type StrapiSingleResponse,
} from '@/lib/strapi';

// Not wrapped in unstable_cache (which is server-only) — safe to call
// directly from a client component, e.g. when reordering past dishes.
export async function getDishByDocumentId(
  documentId: string,
): Promise<Dish | null> {
  try {
    const data = await strapiGet<StrapiSingleResponse<Dish>>(
      `/dishes/${documentId}?populate[image]=true&populate[restaurant]=true`,
    );
    return data.data ?? null;
  } catch {
    return null;
  }
}

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
