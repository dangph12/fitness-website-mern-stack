import React from 'react';

import { WorkoutsProvider } from '~/components/admin/workouts/workouts-provider';
import { WorkoutsTable } from '~/components/admin/workouts/workouts-table';

const ManageWorkouts = () => {
  return (
    <WorkoutsProvider>
      <div className='space-y-6'>
        <WorkoutsTable />
      </div>
    </WorkoutsProvider>
  );
};

export default ManageWorkouts;
