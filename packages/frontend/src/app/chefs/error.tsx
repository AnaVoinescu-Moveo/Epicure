'use client';

import { COPY } from '@/constants/copy';
import styles from './ChefsError.module.css';

interface ChefsErrorProps {
  reset: () => void;
}

export default function ChefsError({ reset }: ChefsErrorProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.message}>{COPY.chefs.errorMessage}</p>
      <button className={styles.retry} onClick={reset}>
        {COPY.chefs.errorRetry}
      </button>
    </div>
  );
}
