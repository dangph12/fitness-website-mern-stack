import React from 'react';

import HistoryChart from '~/components/history-chart';
import HistoryList from '~/components/history-list';

function page() {
  return (
    <div className='space-y-10'>
      <HistoryChart />
      <HistoryList />
    </div>
  );
}

export default page;
