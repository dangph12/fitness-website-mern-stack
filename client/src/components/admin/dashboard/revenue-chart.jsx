import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '~/components/ui/chart';

const RevenueChart = ({ monthlyRevenue }) => {
  console.log('monthlyRevenue prop:', monthlyRevenue);

  // Generate all 12 months for current year
  const currentYear = new Date().getFullYear();
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  // Initialize chartData with all 12 months set to 0
  const chartData = monthNames.map((month, index) => ({
    month,
    amount: 0,
    fullDate: new Date(currentYear, index, 1) // For sorting if needed
  }));

  // Populate with actual revenue data
  if (monthlyRevenue && typeof monthlyRevenue === 'object') {
    Object.entries(monthlyRevenue).forEach(([dateStr, amount]) => {
      const date = new Date(dateStr);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      // Only include current year data
      if (year === currentYear) {
        chartData[monthIndex].amount += amount;
      }
    });
  }

  console.log('chartData:', chartData);

  const chartConfig = {
    amount: {
      label: 'Revenue',
      color: 'hsl(var(--primary))'
    }
  };

  return (
    <ChartContainer config={chartConfig} className='h-[350px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={chartData}>
          <CartesianGrid
            strokeDasharray='3 3'
            className='stroke-muted'
            vertical={false}
          />
          <XAxis
            dataKey='month'
            stroke='hsl(var(--muted-foreground))'
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke='hsl(var(--muted-foreground))'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={value => `$${value.toLocaleString()}`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator='dot'
                formatter={value => `$${Number(value).toLocaleString()}`}
              />
            }
          />
          <Bar
            dataKey='amount'
            fill='currentColor'
            radius={[8, 8, 0, 0]}
            className='fill-primary'
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default RevenueChart;
