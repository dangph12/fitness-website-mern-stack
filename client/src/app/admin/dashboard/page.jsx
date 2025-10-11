import React from 'react';

import AdminLayout from '../../../layouts/admin-layout';

const Page = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold'>Dashboard</h2>
        <p className='text-muted-foreground'>
          Welcome to your fitness admin dashboard
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-card p-6 rounded-lg border'>
          <h3 className='text-lg font-semibold mb-2'>Total Users</h3>
          <p className='text-2xl font-bold text-primary'>1,234</p>
        </div>
        <div className='bg-card p-6 rounded-lg border'>
          <h3 className='text-lg font-semibold mb-2'>Active Sessions</h3>
          <p className='text-2xl font-bold text-primary'>89</p>
        </div>
        <div className='bg-card p-6 rounded-lg border'>
          <h3 className='text-lg font-semibold mb-2'>Workouts</h3>
          <p className='text-2xl font-bold text-primary'>456</p>
        </div>
        <div className='bg-card p-6 rounded-lg border'>
          <h3 className='text-lg font-semibold mb-2'>Revenue</h3>
          <p className='text-2xl font-bold text-primary'>$12,345</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
