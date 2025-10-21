import React from 'react';

import WorkoutCategory from '~/components/workout-category';
import WorkoutListAdmin from '~/components/workout-list-admin';
import WorkoutList from '~/components/workouts-list';

function page() {
  return (
    <div>
      <WorkoutCategory />
      <WorkoutListAdmin />
      <WorkoutList />
    </div>
  );
}

export default page;
