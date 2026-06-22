import { notFound } from 'next/navigation';
import { getRestaurantByDocumentId } from '@/services/restaurantService';
import { RestaurantDetail } from '@/components/restaurants/RestaurantDetail';
import { COPY } from '@/constants/copy';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const restaurant = await getRestaurantByDocumentId(id);
  return { title: restaurant?.name ?? COPY.restaurants.pageTitle };
}

export default async function RestaurantPage({ params }: Props) {
  const { id } = await params;
  const restaurant = await getRestaurantByDocumentId(id);
  if (!restaurant) notFound();
  return <RestaurantDetail restaurant={restaurant} />;
}
