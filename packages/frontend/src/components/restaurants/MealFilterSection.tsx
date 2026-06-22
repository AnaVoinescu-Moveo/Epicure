'use client';

import { useState } from 'react';
import type { Dish } from '@/lib/strapi';
import { COPY } from '@/constants/copy';
import { MealTypeFilter, type MealType } from './MealTypeFilter';
import { RestaurantDishCard } from './RestaurantDishCard';
import styles from './MealFilterSection.module.css';

interface Props {
  dishes: Dish[];
}

export function MealFilterSection({ dishes }: Props) {
  const [activeMeal, setActiveMeal] = useState<MealType>('breakfast');
  const filteredDishes = dishes.filter((d) => d.mealType === activeMeal);

  return (
    <>
      <div className={styles.filterWrapper}>
        <MealTypeFilter active={activeMeal} onChange={setActiveMeal} />
      </div>
      {filteredDishes.length === 0 ? (
        <p className={styles.emptyMessage}>
          {COPY.restaurantDetail.noDishes(activeMeal)}
        </p>
      ) : (
        <div className={styles.dishes}>
          {filteredDishes.map((dish) => (
            <RestaurantDishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </>
  );
}
