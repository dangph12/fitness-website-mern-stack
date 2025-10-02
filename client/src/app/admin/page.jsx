import React from 'react';

import AdminLayout from '~/layouts/admin-layout';

import Dashboard from './dashboard/page';
function Page() {
  return (
    <div>
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    </div>
  );
}

export default Page;
