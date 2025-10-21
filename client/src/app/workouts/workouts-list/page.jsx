import React from 'react';

import WorkoutCategory from '~/components/workout-category';
import WorkoutList from '~/components/workouts-list';

function page() {
  return (
    <div>
      <WorkoutCategory />
      <WorkoutList />
    </div>
  );
}

export default page;
