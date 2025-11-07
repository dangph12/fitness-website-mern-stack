'use client';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Edit, Eye, Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

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
  fetchUsers,
  setCurrentPage,
  setLimit
} from '~/store/features/users-slice';

import { useUsers } from './users-provider';

// Utility functions
const getUserDisplayName = user => {
  return user.name || user.fullName || user.username || 'Unknown User';
};

const getUserInitials = user => {
  const name = getUserDisplayName(user);
  if (name === 'Unknown User') return 'U';

  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getStatusBadge = user => {
  const isActive = user.isActive !== false;
  return (
    <Badge variant={isActive ? 'default' : 'secondary'}>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
};

const getRoleBadge = role => {
  const variants = {
    admin:
      'bg-orange-100 text-orange-800 dark:bg-purple-900 dark:text-purple-200',
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
};

const getGenderBadge = gender => {
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
};
const getMembershipBadge = level => {
  const variants = {
    normal: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    vip: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    premium:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  };

  return (
    <Badge
      className={
        variants[level] ||
        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      }
    >
      {level || 'normal'}
    </Badge>
  );
};

export function UsersTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    users,
    loading,
    currentPage,
    totalPages,
    totalUsers,
    limit,
    filters
  } = useSelector(state => state.users);

  const { selectedUsers, setSelectedUsers, openDialog } = useUsers();

  // Fetch users when component mounts or pagination/filters change
  useEffect(() => {
    dispatch(
      fetchUsers({
        page: currentPage,
        limit,
        search: filters.search,
        role: filters.role,
        gender: filters.gender,
        membershipLevel: filters.membershipLevel
      })
    );
  }, [dispatch, currentPage, limit, filters]);

  // Handle actions
  const handleViewUser = useCallback(
    user => {
      dispatch(fetchUserDetails(user._id));
      openDialog('details', user);
    },
    [dispatch, openDialog]
  );

  const handleEditUser = useCallback(
    user => {
      // Navigate directly to update page instead of opening modal
      navigate(`/admin/manage-users/update/${user._id}`);
    },
    [navigate]
  );

  const handleDeleteUser = useCallback(
    user => {
      openDialog('delete', user);
    },
    [openDialog]
  );

  // Table columns definition
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={value => {
              table.toggleAllPageRowsSelected(!!value);
              if (value) {
                setSelectedUsers(users.map(user => user._id));
              } else {
                setSelectedUsers([]);
              }
            }}
            aria-label='Select all'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedUsers.includes(row.original._id)}
            onCheckedChange={value => {
              const userId = row.original._id;
              if (value) {
                setSelectedUsers(prev => [...prev, userId]);
              } else {
                setSelectedUsers(prev => prev.filter(id => id !== userId));
              }
            }}
            aria-label='Select row'
          />
        ),
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: 'user',
        header: 'User',
        cell: ({ row }) => {
          const user = row.original;
          return (
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
          );
        }
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => row.getValue('email')
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => getRoleBadge(row.getValue('role'))
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        cell: ({ row }) => getGenderBadge(row.getValue('gender'))
      },
      {
        accessorKey: 'membershipLevel',
        header: 'Membership',
        cell: ({ row }) => getMembershipBadge(row.getValue('membershipLevel'))
      },
      {
        accessorKey: 'membershipExpiresAt',
        header: 'Expires At',
        cell: ({ row }) => {
          const expiresAt = row.getValue('membershipExpiresAt');
          const membershipLevel = row.original.membershipLevel;

          if (!expiresAt || membershipLevel === 'normal') {
            return <span className='text-muted-foreground'>-</span>;
          }

          const expiryDate = new Date(expiresAt);
          const now = new Date();
          const isExpired = expiryDate < now;
          const daysUntilExpiry = Math.ceil(
            (expiryDate - now) / (1000 * 60 * 60 * 24)
          );

          return (
            <div className='flex flex-col'>
              <span className={isExpired ? 'text-red-600' : ''}>
                {formatDate(expiresAt)}
              </span>
              {!isExpired && daysUntilExpiry <= 7 && (
                <span className='text-xs text-orange-600'>
                  {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''} left
                </span>
              )}
              {isExpired && (
                <span className='text-xs text-red-600'>Expired</span>
              )}
            </div>
          );
        }
      },
      {
        accessorKey: 'dob',
        header: 'DOB',
        cell: ({ row }) => {
          const dob = row.getValue('dob');
          return dob ? formatDate(dob) : '-';
        }
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => getStatusBadge(row.original)
      },
      {
        accessorKey: 'createdAt',
        header: 'Joined',
        cell: ({ row }) => {
          const createdAt = row.getValue('createdAt');
          return createdAt ? formatDate(createdAt) : '-';
        }
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const user = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => handleViewUser(user)}>
                  <Eye className='mr-2 h-4 w-4' />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                  <Edit className='mr-2 h-4 w-4' />
                  Edit User
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteUser(user)}
                  className='text-red-600'
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableSorting: false,
        enableHiding: false
      }
    ],
    [
      users,
      selectedUsers,
      setSelectedUsers,
      handleViewUser,
      handleEditUser,
      handleDeleteUser
    ]
  );

  // Create table instance with server-side pagination
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: limit
      }
    },
    onPaginationChange: updater => {
      const newPagination =
        typeof updater === 'function'
          ? updater({
              pageIndex: currentPage - 1,
              pageSize: limit
            })
          : updater;

      if (newPagination.pageIndex !== currentPage - 1) {
        dispatch(setCurrentPage(newPagination.pageIndex + 1));
      }

      if (newPagination.pageSize !== limit) {
        dispatch(setLimit(newPagination.pageSize));
      }
    }
  });

  if (loading && users.length === 0) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin' />
        <span className='ml-2'>Loading users...</span>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
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

      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <Button
                        variant='ghost'
                        onClick={() => header.column.toggleSorting()}
                        className='p-0 h-auto font-medium hover:bg-transparent'
                      >
                        {typeof header.column.columnDef.header === 'function'
                          ? header.column.columnDef.header(header.getContext())
                          : header.column.columnDef.header}
                      </Button>
                    ) : typeof header.column.columnDef.header === 'function' ? (
                      header.column.columnDef.header(header.getContext())
                    ) : (
                      header.column.columnDef.header
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {typeof cell.column.columnDef.cell === 'function'
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.getValue()}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {loading ? (
                    <div className='flex items-center justify-center'>
                      <Loader2 className='h-4 w-4 animate-spin mr-2' />
                      Loading...
                    </div>
                  ) : (
                    <div>
                      <div>No users found</div>
                      <div className='text-xs text-muted-foreground mt-1'>
                        Total users: {totalUsers}
                      </div>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        table={table}
        loading={loading}
        showSelection={true}
      />
    </div>
  );
}
