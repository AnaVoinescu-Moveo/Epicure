import type { StrapiMedia } from './strapi.types.js';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface DishAttributes {
  name: string;
  description: string | null;
  price: number;
  image: { data: StrapiMedia | null };
  isSignature: boolean;
  isSpicy: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  mealType: MealType | null;
}

export interface Dish {
  id: number;
  attributes: DishAttributes;
}
