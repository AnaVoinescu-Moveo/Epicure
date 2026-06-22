import { type Chef } from '@/lib/strapi';
import { COPY } from '@/constants/copy';
import { ChefsFilterSection } from './ChefsFilterSection';
import styles from './ChefsPage.module.css';

interface ChefsPageProps {
  chefs: Chef[];
}

export function ChefsPage({ chefs }: ChefsPageProps) {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{COPY.chefs.pageTitle}</h1>
      <ChefsFilterSection chefs={chefs} />
    </div>
  );
}
