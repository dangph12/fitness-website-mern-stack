import React from 'react';

import ExerciseDetail from '~/components/exercise-detail';
import RecommendedExercises from '~/components/recommended-exercises';

function page() {
  return (
    <div>
      <ExerciseDetail />
      <RecommendedExercises />
    </div>
  );
}

export default page;
