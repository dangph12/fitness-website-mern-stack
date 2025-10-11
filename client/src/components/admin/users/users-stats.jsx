'use client';

import { Crown, UserCheck, Users, UserX } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

export function UsersStats() {
  const { users, totalUsers } = useSelector(state => state.users);

  const stats = React.useMemo(() => {
    const total = totalUsers || users.length;
    const active = users.filter(user => user.isActive !== false).length;
    const inactive = users.filter(user => user.isActive === false).length;
    const admins = users.filter(user => user.role === 'admin').length;

    return { total, active, inactive, admins };
  }, [users, totalUsers]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Users',
      value: stats.active,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Inactive Users',
      value: stats.inactive,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Admins',
      value: stats.admins,
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {statCards.map(stat => (
        <Card key={stat.title}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
            <div className={`rounded-full p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
