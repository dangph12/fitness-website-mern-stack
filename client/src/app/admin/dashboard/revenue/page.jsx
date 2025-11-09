import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MembershipBreakdown from '~/components/admin/dashboard/membership-breakdown';
import PaymentStats from '~/components/admin/dashboard/payment-stats';
import RevenueChart from '~/components/admin/dashboard/revenue-chart';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { fetchRevenueStats } from '~/store/features/payment-slice';

const RevenuePage = () => {
  const dispatch = useDispatch();
  const { revenueStats, loading, error } = useSelector(state => state.payments);

  useEffect(() => {
    dispatch(fetchRevenueStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <p className='text-center text-destructive'>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Payment Stats Cards */}
      <PaymentStats stats={revenueStats} />

      {/* Revenue Chart & Membership Breakdown */}
      <div className='grid gap-4 md:grid-cols-7'>
        <Card className='md:col-span-4'>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className='pl-2'>
            <RevenueChart monthlyRevenue={revenueStats.monthlyRevenue} />
          </CardContent>
        </Card>

        <Card className='md:col-span-3'>
          <CardHeader>
            <CardTitle>Membership Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <MembershipBreakdown stats={revenueStats} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RevenuePage;
