import React from 'react';

import RevenuePage from '~/app/admin/dashboard/revenue/page';
import { MembershipsProvider } from '~/components/admin/memberships/memberships-provider';
import MembershipsTable from '~/components/admin/memberships/memberships-table';
const MembershipsPage = () => {
  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      <RevenuePage />
      <MembershipsProvider>
        <MembershipsTable />
      </MembershipsProvider>
    </div>
  );
};

export default MembershipsPage;
