import type { StrapiMedia } from './strapi.types.js';
import type { Dish } from './dish.types.js';

export type PriceRange = 'low' | 'medium' | 'high';

export interface RestaurantAttributes {
  name: string;
  image: { data: StrapiMedia | null };
  rating: number | null;
  priceRange: PriceRange | null;
  distance: number | null;
  isNew: boolean;
  popularityScore: number;
  openingTime: string | null;
  closingTime: string | null;
  latitude: number | null;
  longitude: number | null;
  chef?: {
    data: { id: number; attributes: { name: string } } | null;
  };
  dishes?: {
    data: Dish[];
  };
}

export interface Restaurant {
  id: number;
  attributes: RestaurantAttributes;
}
