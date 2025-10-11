'use client';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Checkbox } from '~/components/ui/checkbox';

import { DataTableColumnHeader } from '../data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const UsersColumns = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className='flex items-center space-x-3'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className='font-medium'>{user.name}</div>
            <div className='text-sm text-muted-foreground'>{user.username}</div>
          </div>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'email',
    id: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[200px] truncate'>{row.getValue('email')}</div>
    ),
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: 'phone',
    id: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone Number' />
    ),
    cell: ({ row }) => <div>{row.original.phone || 'N/A'}</div>,
    enableSorting: false,
    enableHiding: true
  },
  {
    accessorKey: 'role',
    id: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role');
      const getRoleBadgeVariant = role => {
        switch (role) {
          case 'admin':
            return 'destructive';
          case 'instructor':
            return 'default';
          default:
            return 'secondary';
        }
      };

      return <Badge variant={getRoleBadgeVariant(role)}>{role}</Badge>;
    },
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: 'gender',
    id: 'gender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gender' />
    ),
    cell: ({ row }) => {
      const gender = row.getValue('gender');
      const getGenderBadgeVariant = gender => {
        switch (gender) {
          case 'male':
            return 'default';
          case 'female':
            return 'secondary';
          default:
            return 'outline';
        }
      };

      return (
        <Badge variant={getGenderBadgeVariant(gender)}>
          {gender || 'Not specified'}
        </Badge>
      );
    },
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: 'createdAt',
    id: 'joined',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Joined' />
    ),
    cell: ({ row }) => (
      <div>{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>
    ),
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: 'isActive',
    id: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive');
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
    enableSorting: true,
    enableHiding: true
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <DataTableRowActions user={row.original} />,
    enableSorting: false,
    enableHiding: false
  }
];
