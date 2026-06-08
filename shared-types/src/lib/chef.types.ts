import type { StrapiMedia } from './strapi.types.js';

export interface ChefAttributes {
  name: string;
  image: { data: StrapiMedia | null };
  description: string | null;
  isChefOfTheWeek: boolean;
  restaurants?: {
    data: Array<{ id: number; attributes: Record<string, unknown> }>;
  };
}

export interface Chef {
  id: number;
  attributes: ChefAttributes;
}
