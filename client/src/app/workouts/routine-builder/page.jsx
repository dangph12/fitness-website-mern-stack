import React from 'react';

import CreateWorkout from '~/components/create-workout';
import ExerciseLibrary from '~/components/exercise-library';

function Page() {
  return (
    <div className='flex space-x-8 p-6'>
      <div className='w-5/6'>
        <CreateWorkout />
      </div>

      <div className='w-1/2'>
        <ExerciseLibrary />
      </div>
    </div>
  );
}

export default Page;
