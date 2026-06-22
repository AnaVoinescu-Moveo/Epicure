import { notFound } from 'next/navigation';
import { getAllRestaurants } from '@/services/restaurantService';
import { CuisineRestaurantsPage } from '@/components/cuisine/CuisineRestaurantsPage';
import { CUISINES } from '@/lib/searchUtils';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cuisine = CUISINES.find((c) => c.slug === slug);
  return { title: cuisine?.label ?? 'Cuisine' };
}

export default async function CuisinePage({ params }: Props) {
  const { slug } = await params;
  const cuisine = CUISINES.find((c) => c.slug === slug);
  if (!cuisine) notFound();

  const allRestaurants = await getAllRestaurants();
  const restaurants = allRestaurants.filter((r) => r.cuisine === cuisine.slug);

  return (
    <CuisineRestaurantsPage
      cuisineLabel={cuisine.label}
      restaurants={restaurants}
    />
  );
}
