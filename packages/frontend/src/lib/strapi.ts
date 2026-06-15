import { STRAPI_URL } from '@/config/env';

const BASE = STRAPI_URL;

export function strapiUrl(path: string): string {
  return `${BASE}${path}`;
}

export async function strapiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Strapi ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// Strapi v5 uses flat document structure (no `attributes` wrapper).
// TODO: move to @org/shared-types once it's added to frontend package.json dependencies.

export interface StrapiListResponse<T> {
  data: T[];
  meta: {
    pagination: { start: number; limit: number; total: number };
  };
}

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string | null;
}

export interface StrapiChef {
  id: number;
  name: string;
}

export interface Restaurant {
  id: number;
  documentId: string;
  name: string;
  image: StrapiImage | null;
  rating: number | null;
  chef: StrapiChef | null;
}
