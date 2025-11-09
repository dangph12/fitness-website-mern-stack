import React from 'react';

import HistoryChart from '~/components/history-chart';
import HistoryList from '~/components/history-list';
import UserStreak from '~/components/user-streak';
function page() {
  return (
    <div className='space-y-10'>
      <UserStreak />
      <HistoryChart />
      <HistoryList />
    </div>
  );
}

export default page;
