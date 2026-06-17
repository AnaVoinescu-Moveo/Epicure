'use client';

import { COPY } from '@/constants/copy';
import styles from './RestaurantsError.module.css';

interface RestaurantsErrorProps {
  reset: () => void;
}

export default function RestaurantsError({ reset }: RestaurantsErrorProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.message}>{COPY.restaurants.errorMessage}</p>
      <button className={styles.retry} onClick={reset}>
        {COPY.restaurants.errorRetry}
      </button>
    </div>
  );
}
