import { getAllChefs } from '@/services/chefService';
import { ChefsPage } from '@/components/chefs/ChefsPage';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const chefs = await getAllChefs();
  return <ChefsPage chefs={chefs} />;
}
