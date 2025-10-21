import React from 'react';

import { ExercisesProvider } from '~/components/admin/exercises/exercises-provider';
import { ExercisesTable } from '~/components/admin/exercises/exercises-table';

const ManageExercises = () => {
  return (
    <ExercisesProvider>
      <div className='space-y-6'>
        <ExercisesTable />
      </div>
    </ExercisesProvider>
  );
};

export default ManageExercises;
