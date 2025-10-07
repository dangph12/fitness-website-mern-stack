import React from 'react';

import EquipmentList from '~/components/equipment-list';
import ExerciseList from '~/components/exercise-list';
import MuscleList from '~/components/muscle-list';

function page() {
  return (
    <div>
      <MuscleList />
      <EquipmentList />
      <ExerciseList />
    </div>
  );
}

export default page;
