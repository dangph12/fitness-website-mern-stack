import React, { useState } from 'react';

import CreateWorkout from '~/components/create-workout';

function Page() {
  const [selectedExercises, setSelectedExercises] = useState([]);

  return (
    <div>
      <CreateWorkout
        selectedExercises={selectedExercises}
        setSelectedExercises={setSelectedExercises}
      />
    </div>
  );
}

export default Page;
