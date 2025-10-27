import { LineChart } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';

export default function HistoryChart() {
  const { history = [] } = useSelector(state => state.histories);

  const dayCount = {};
  history
    .filter(h => h.workout?._id || h.workout?.id)
    .forEach(h => {
      const date = new Date(h.createdAt).toLocaleDateString('en-GB');
      dayCount[date] = (dayCount[date] || 0) + 1;
    });

  const data = Object.entries(dayCount).map(([date, count]) => ({
    date,
    count
  }));

  if (!data.length) {
    return (
      <div className='w-full max-w-4xl mx-auto py-10 px-6 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50'>
        <p className='text-slate-700 font-medium'>No workout progress yet.</p>
        <p className='text-slate-400 text-xs mt-1'>
          Start your first workout to track improvement.
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count), 1);

  const coloredData = data.map(d => ({
    ...d,
    barColor: `rgba(34,197,94,${0.3 + (d.count / maxCount) * 0.7})`
  }));

  return (
    <div className='w-full max-w-5xl mx-auto mb-12 mt-10'>
      <h3 className='text-lg sm:text-xl font-medium text-slate-700 mb-4 flex items-center gap-2'>
        <LineChart className='w-5 h-5 text-emerald-600' />
        Workout Frequency Trends
      </h3>

      <ChartContainer
        config={{
          count: { label: 'Sessions', color: '#22c55e' }
        }}
        className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
      >
        <BarChart data={coloredData}>
          <CartesianGrid strokeDasharray='3 3' opacity={0.25} />
          <XAxis dataKey='date' tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />

          <Bar dataKey='count' radius={[6, 6, 0, 0]}>
            {coloredData.map((entry, index) => (
              <Cell key={index} fill={entry.barColor} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      <div className='mt-3 flex justify-between text-xs text-slate-500 px-1'>
        <span>Less Active</span>
        <span>More Active</span>
      </div>
    </div>
  );
}
