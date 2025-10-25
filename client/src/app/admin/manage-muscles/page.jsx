import React from 'react';

import { MusclesDialogs } from '~/components/admin/muscles/muscles-dialogs';
import { MusclesProvider } from '~/components/admin/muscles/muscles-provider';
import { MusclesTable } from '~/components/admin/muscles/muscles-table';

const ManageMuscles = () => {
  return (
    <MusclesProvider>
      <div className='space-y-6'>
        <MusclesTable />
        <MusclesDialogs />
      </div>
    </MusclesProvider>
  );
};

export default ManageMuscles;
