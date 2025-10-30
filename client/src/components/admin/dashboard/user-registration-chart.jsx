'use client';

import { format, subDays } from 'date-fns';
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '~/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import axiosInstance from '~/lib/axios-instance';

const chartConfig = {
  registrations: {
    label: 'Registrations',
    color: 'hsl(var(--primary))'
  }
};

export function UserRegistrationChart() {
  const [timeRange, setTimeRange] = React.useState('30d');
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [totalRegistrations, setTotalRegistrations] = React.useState(0);

  React.useEffect(() => {
    fetchRegistrationData();
  }, [timeRange]);

  const fetchRegistrationData = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const days = timeRange === '90d' ? 90 : timeRange === '30d' ? 30 : 7;
      const endDate = new Date();
      const startDate = subDays(endDate, days);

      // Fetch users data
      const response = await axiosInstance.get('/api/users', {
        params: {
          page: 1,
          limit: 1000, // Get enough users for the time period
          sortBy: 'createdAt',
          sortOrder: 'asc'
        }
      });

      const users = response.data?.data?.users || [];

      // Group users by date
      const registrationsByDate = {};

      users.forEach(user => {
        if (user.createdAt) {
          const date = new Date(user.createdAt);
          if (date >= startDate && date <= endDate) {
            const dateKey = format(date, 'yyyy-MM-dd');
            registrationsByDate[dateKey] =
              (registrationsByDate[dateKey] || 0) + 1;
          }
        }
      });

      // Create complete dataset with all dates
      const data = [];
      let total = 0;

      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(endDate, i);
        const dateKey = format(date, 'yyyy-MM-dd');
        const count = registrationsByDate[dateKey] || 0;
        total += count;

        data.push({
          date: dateKey,
          registrations: count
        });
      }

      setChartData(data);
      setTotalRegistrations(total);
    } catch (error) {
      console.error('Error fetching registration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = chartData;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Registrations</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[250px] flex items-center justify-center'>
            <div className='animate-pulse text-muted-foreground'>
              Loading chart data...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>User Registrations</CardTitle>
          <CardDescription>
            Total registrations:{' '}
            <span className='font-semibold text-foreground'>
              {totalRegistrations}
            </span>{' '}
            users in the last{' '}
            {timeRange === '90d'
              ? '3 months'
              : timeRange === '30d'
                ? '30 days'
                : '7 days'}
          </CardDescription>
        </div>
        <div className='flex px-6 py-5 sm:py-6'>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className='w-[160px] rounded-lg sm:ml-auto'
              aria-label='Select time range'
            >
              <SelectValue placeholder='Last 30 days' />
            </SelectTrigger>
            <SelectContent className='rounded-xl'>
              <SelectItem value='90d' className='rounded-lg'>
                Last 3 months
              </SelectItem>
              <SelectItem value='30d' className='rounded-lg'>
                Last 30 days
              </SelectItem>
              <SelectItem value='7d' className='rounded-lg'>
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart
            data={filteredData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient
                id='fillRegistrations'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop
                  offset='5%'
                  stopColor='var(--color-registrations)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-registrations)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value);
                return format(date, 'MMM dd');
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    return format(new Date(value), 'MMMM dd, yyyy');
                  }}
                  indicator='dot'
                />
              }
            />
            <Area
              dataKey='registrations'
              type='natural'
              fill='url(#fillRegistrations)'
              fillOpacity={0.4}
              stroke='var(--color-registrations)'
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
