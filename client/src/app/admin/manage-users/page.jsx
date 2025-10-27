'use client';

import { RefreshCw } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { UsersDialogs } from '~/components/admin/users/users-dialogs';
import { UsersFilters } from '~/components/admin/users/users-filters';
import { UsersPrimaryButtons } from '~/components/admin/users/users-primary-buttons';
import { UsersProvider } from '~/components/admin/users/users-provider';
import { UsersStats } from '~/components/admin/users/users-stats';
import { UsersTable } from '~/components/admin/users/users-table';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { clearErrors, fetchUsers } from '~/store/features/users-slice';

function ManageUsersContent() {
  const dispatch = useDispatch();
  const { loading, error, currentPage, limit, filters } = useSelector(
    state => state.users
  );

  // Memoized fetch function
  const fetchUsersData = useCallback(() => {
    const searchParams = {
      page: currentPage,
      limit,
      search: filters.search || '',
      role: Array.isArray(filters.role) ? filters.role : [],
      gender: Array.isArray(filters.gender) ? filters.gender : []
    };

    console.log('Fetching users with params:', searchParams);
    dispatch(fetchUsers(searchParams));
  }, [dispatch, currentPage, limit, filters]);

  // Initial fetch and when dependencies change
  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  const handleRefresh = useCallback(() => {
    dispatch(clearErrors());
    fetchUsersData();
  }, [dispatch, fetchUsersData]);

  return (
    <div className='w-full px-6 py-6 space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Manage Users</h1>
          <p className='text-muted-foreground'>
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <UsersPrimaryButtons />
        </div>
      </div>

      <Separator />

      {/* Error Display */}
      {error && (
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4'>
          <p className='text-red-800 dark:text-red-200'>{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <UsersStats />

      {/* Users Table */}
      <Card>
        <CardContent>
          <UsersFilters />
          <UsersTable />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <UsersDialogs />
    </div>
  );
}

export default function ManageUsersPage() {
  return (
    <UsersProvider>
      <ManageUsersContent />
    </UsersProvider>
  );
}
