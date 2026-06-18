import { notFound } from 'next/navigation';
import { getChefByDocumentId } from '@/services/chefService';
import { ChefDetailPage } from '@/components/chefs/ChefDetailPage';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ documentId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { documentId } = await params;
  const chef = await getChefByDocumentId(documentId);
  return { title: chef?.name ?? 'Chef' };
}

export default async function ChefPage({ params }: Props) {
  const { documentId } = await params;
  const chef = await getChefByDocumentId(documentId);
  if (!chef) notFound();
  return <ChefDetailPage chef={chef} />;
}
