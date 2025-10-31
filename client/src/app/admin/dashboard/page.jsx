import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

import Overview from './overview/page';
import Revenue from './revenue/page';

const DashboardLayout = () => {
  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='revenue'>Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <Overview />
        </TabsContent>

        <TabsContent value='revenue' className='space-y-4'>
          <Revenue />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardLayout;
