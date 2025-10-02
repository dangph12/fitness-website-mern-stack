import React from 'react';

import MealsList from '~/components/meal-list';
import NutriBanner from '~/components/nutri-banner';
import NutriBanner2 from '~/components/nutri-banner2';

function page() {
  return (
    <div>
      <NutriBanner />
      <NutriBanner2 />
      <MealsList />
    </div>
  );
}

export default page;
