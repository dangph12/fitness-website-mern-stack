import React from 'react';

import AdminMealList from '~/components/admin-meal-list';
import MealsList from '~/components/meal-list';
import NutriBanner from '~/components/nutri-banner';
import NutriBanner2 from '~/components/nutri-banner2';

function page() {
  return (
    <div>
      <NutriBanner />
      <NutriBanner2 />
      <MealsList />
      <AdminMealList />
    </div>
  );
}

export default page;
