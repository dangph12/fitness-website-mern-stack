'use client';

import { Edit, Eye, Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import React, { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DataTablePagination } from '~/components/admin/data-table-pagination';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table';
import { formatDate } from '~/lib/utils';
import {
  fetchUserDetails,
  setCurrentPage,
  setLimit
} from '~/store/features/users-slice';

import { useUsers } from './users-provider';

// Memoized user row component
const UserRow = memo(
  ({ user, isSelected, onSelect, onView, onEdit, onDelete }) => {
    const getUserDisplayName = useCallback(user => {
      return user.name || user.fullName || user.username || 'Unknown User';
    }, []);

    const getUserInitials = useCallback(
      user => {
        const name = getUserDisplayName(user);
        if (name === 'Unknown User') return 'U';

        return name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
      },
      [getUserDisplayName]
    );

    const getStatusBadge = useCallback(user => {
      const isActive = user.isActive !== false;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    }, []);

    const getRoleBadge = useCallback(role => {
      const variants = {
        admin:
          'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        instructor:
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        user: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      };

      return (
        <Badge
          className={
            variants[role] ||
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }
        >
          {role || 'user'}
        </Badge>
      );
    }, []);

    const getGenderBadge = useCallback(gender => {
      if (!gender) return <span className='text-muted-foreground'>-</span>;

      const variants = {
        male: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        female: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
        other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      };

      return (
        <Badge
          className={
            variants[gender] ||
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }
        >
          {gender}
        </Badge>
      );
    }, []);

    return (
      <TableRow key={user._id}>
        <TableCell>
          <Checkbox
            checked={isSelected}
            onCheckedChange={checked => onSelect(user._id, checked)}
          />
        </TableCell>
        <TableCell>
          <div className='flex items-center space-x-3'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user.avatar} alt={getUserDisplayName(user)} />
              <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
            </Avatar>
            <div>
              <div className='font-medium'>{getUserDisplayName(user)}</div>
              {user.username && (
                <div className='text-sm text-muted-foreground'>
                  @{user.username}
                </div>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{getRoleBadge(user.role)}</TableCell>
        <TableCell>{getGenderBadge(user.gender)}</TableCell>
        <TableCell>{user.dob ? formatDate(user.dob) : '-'}</TableCell>
        <TableCell>{getStatusBadge(user)}</TableCell>
        <TableCell>
          {user.createdAt ? formatDate(user.createdAt) : '-'}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onView(user)}>
                <Eye className='mr-2 h-4 w-4' />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Edit className='mr-2 h-4 w-4' />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(user)}
                className='text-red-600'
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  }
);

UserRow.displayName = 'UserRow';

export function UsersTable() {
  const dispatch = useDispatch();
  const { users, loading, currentPage, totalPages, totalUsers, limit } =
    useSelector(state => state.users);

  const { selectedUsers, setSelectedUsers, openDialog } = useUsers();

  // Debug: Log state changes
  useEffect(() => {
    console.log(' UsersTable state update:', {
      usersCount: users.length,
      totalUsers,
      totalPages,
      loading,
      users: users.map(u => ({ name: u.name, email: u.email }))
    });
  }, [users, totalUsers, totalPages, loading]);

  const handleSelectAll = useCallback(
    checked => {
      if (checked) {
        setSelectedUsers(users.map(user => user._id));
      } else {
        setSelectedUsers([]);
      }
    },
    [users, setSelectedUsers]
  );

  const handleSelectUser = useCallback(
    (userId, checked) => {
      if (checked) {
        setSelectedUsers(prev => [...prev, userId]);
      } else {
        setSelectedUsers(prev => prev.filter(id => id !== userId));
      }
    },
    [setSelectedUsers]
  );

  const handleViewUser = useCallback(
    user => {
      dispatch(fetchUserDetails(user._id));
      openDialog('details', user);
    },
    [dispatch, openDialog]
  );

  const handleEditUser = useCallback(
    user => {
      dispatch(fetchUserDetails(user._id));
      openDialog('action', user, 'edit');
    },
    [dispatch, openDialog]
  );

  const handleDeleteUser = useCallback(
    user => {
      openDialog('delete', user);
    },
    [openDialog]
  );

  const handlePageChange = useCallback(
    page => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  const handlePageSizeChange = useCallback(
    newLimit => {
      dispatch(setLimit(newLimit));
    },
    [dispatch]
  );

  if (loading && users.length === 0) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin' />
        <span className='ml-2'>Loading users...</span>
      </div>
    );
  }

  const isAllSelected =
    selectedUsers.length === users.length && users.length > 0;
  const isIndeterminate =
    selectedUsers.length > 0 && selectedUsers.length < users.length;

  console.log('Rendering UsersTable with:', {
    usersLength: users.length,
    loading,
    totalUsers
  });

  return (
    <div className='space-y-4'>
      {/* Debug info */}
      {/* <div className="bg-gray-50 dark:bg-gray-900/20 border rounded p-2 text-xs">
        <strong>Table Debug:</strong> Rendering {users.length} users | Total: {totalUsers} | Loading: {loading.toString()}
      </div> */}

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className='flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
          <span className='text-sm font-medium'>
            {selectedUsers.length} user(s) selected
          </span>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => openDialog('multiDelete')}
          >
            <Trash2 className='h-4 w-4 mr-2' />
            Delete Selected
          </Button>
        </div>
      )}

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-12'>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  ref={ref => {
                    if (ref) ref.indeterminate = isIndeterminate;
                  }}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Gender</TableHead>

              <TableHead>DOB</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className='w-12'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className='text-center py-8'>
                  {loading ? (
                    <div className='flex items-center justify-center'>
                      <Loader2 className='h-4 w-4 animate-spin mr-2' />
                      Loading...
                    </div>
                  ) : (
                    <div>
                      <div>No users found</div>
                      <div className='text-xs text-muted-foreground mt-1'>
                        Total in state: {totalUsers} | Users array length:{' '}
                        {users.length}
                      </div>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => (
                <UserRow
                  key={user._id}
                  user={user}
                  isSelected={selectedUsers.includes(user._id)}
                  onSelect={handleSelectUser}
                  onView={handleViewUser}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalUsers}
        pageSize={limit}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={loading}
      />
    </div>
  );
}
