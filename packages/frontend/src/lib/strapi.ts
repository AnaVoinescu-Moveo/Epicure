import { STRAPI_URL } from '@/config/env';

const BASE = STRAPI_URL;

// Prepend BASE only for relative paths; absolute URLs (e.g. from a CDN media provider) are returned as-is.
export function strapiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE}${path}`;
}

// path must NOT include /api — this helper prepends it automatically.
export async function strapiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Strapi ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// Strapi v5 uses flat document structure (no `attributes` wrapper).
// TODO: move to @org/shared-types once it's added to frontend package.json dependencies.

export interface StrapiSingleResponse<T> {
  data: T;
}

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

export interface Chef {
  id: number;
  documentId: string;
  name: string;
  description: string | null;
  image: StrapiImage | null;
  isChefOfTheWeek: boolean;
  isNew: boolean;
  isMostViewed: boolean;
  restaurants: Restaurant[];
}

export interface Restaurant {
  id: number;
  documentId: string;
  name: string;
  image: StrapiImage | null;
  rating: number | null;
  chef: StrapiChef | null;
  isNew: boolean;
  openingTime: string | null;
  closingTime: string | null;
  latitude: number | null;
  longitude: number | null;
  dishes?: Dish[];
}

export interface Dish {
  id: number;
  documentId: string;
  name: string;
  description: string | null;
  price: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | null;
  isSignature: boolean;
  isSpicy: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  image: StrapiImage | null;
}
