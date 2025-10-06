import {
  Edit,
  Eye,
  MoreHorizontal,
  Shield,
  Trash2,
  UserMinus
} from 'lucide-react';
import React from 'react';
import { useDispatch } from 'react-redux';

// Redux
import { deleteUser } from '../../store/features/users-slice';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// UI Components
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
// Table Components
import { DataTableColumnHeader } from './data-table-column-header';

// Component riêng cho Actions
const ActionsCell = ({ user }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(user._id));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(user._id)}
        >
          Copy user ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Eye className='mr-2 h-4 w-4' />
          View user
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className='mr-2 h-4 w-4' />
          Edit user
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Shield className='mr-2 h-4 w-4' />
          Change role
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserMinus className='mr-2 h-4 w-4' />
          {user.isActive ? 'Deactivate' : 'Activate'} user
        </DropdownMenuItem>
        <DropdownMenuItem className='text-red-600' onClick={handleDelete}>
          <Trash2 className='mr-2 h-4 w-4' />
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Columns = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className='flex items-center space-x-3'>
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={user.avatar || user.profilePicture}
              alt={user.name}
            />
            <AvatarFallback>
              {user.name
                ?.split(' ')
                .map(n => n[0])
                .join('') || user.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className='font-medium'>{user.name || 'No name'}</div>
            <div className='text-sm text-muted-foreground'>{user.email}</div>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role');
      const roleConfig = {
        admin: { label: 'Admin', variant: 'destructive' },
        moderator: { label: 'Moderator', variant: 'secondary' },
        user: { label: 'User', variant: 'outline' }
      };

      return (
        <Badge variant={roleConfig[role]?.variant || 'outline'}>
          {roleConfig[role]?.label || role || 'User'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gender' />
    ),
    cell: ({ row }) => {
      const gender = row.getValue('gender');
      return <span className='capitalize'>{gender || 'Not specified'}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'isActive',
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
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return <div className='text-sm'>{date.toLocaleDateString()}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      return <ActionsCell user={user} />;
    }
  }
];
