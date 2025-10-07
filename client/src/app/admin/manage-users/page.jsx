import { Loader2, Plus } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DataTable } from '../../../components/admin/data-table';
import { Columns } from '../../../components/admin/users-columns'; // Thay đổi từ createColumns thành columns
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../components/ui/card';
import AdminLayout from '../../../layouts/admin-layout.jsx';
import {
  clearErrors,
  clearFilters,
  deleteUser,
  fetchUsers,
  setCurrentPage,
  setFilters,
  setLimit
} from '../../../store/features/users-slice';

export default function ManageUsersPage() {
  const dispatch = useDispatch();
  const {
    users,
    loading,
    error,
    totalPages,
    totalUsers,
    currentPage,
    limit,
    filters
  } = useSelector(state => state.users);

  // Fetch users on component mount and when filters change
  useEffect(() => {
    dispatch(
      fetchUsers({
        page: currentPage,
        limit,
        name: filters.search,
        role: filters.role,
        gender: filters.gender
      })
    );
  }, [dispatch, currentPage, limit, filters]);

  // Clear errors on component mount
  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const handlePageChange = page => {
    dispatch(setCurrentPage(page));
  };

  const handleLimitChange = newLimit => {
    dispatch(setLimit(newLimit));
  };

  const handleFiltersChange = newFilters => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  if (loading && users.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='flex items-center space-x-2'>
          <Loader2 className='h-6 w-6 animate-spin' />
          <span>Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Users Management
          </h1>
          <p className='text-muted-foreground'>
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Add User
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant='destructive'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Users ({totalUsers})</CardTitle>
          <CardDescription>
            A list of all users in your system including their name, email,
            role, and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={Columns}
            data={users}
            loading={loading}
            pagination={{
              page: currentPage,
              pageSize: limit,
              totalPages,
              totalItems: totalUsers,
              onPageChange: handlePageChange,
              onPageSizeChange: handleLimitChange
            }}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </CardContent>
      </Card>
    </div>
  );
}
