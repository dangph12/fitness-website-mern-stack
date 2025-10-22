'use client';

import {
  Edit,
  Eye,
  Mail,
  MoreHorizontal,
  Shield,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';

import { useUsers } from './users-provider';

export function DataTableRowActions({ user }) {
  const { openDialog } = useUsers();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => openDialog('details', user)}>
          <Eye className='mr-2 h-4 w-4' />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openDialog('action', user, 'edit')}>
          <Edit className='mr-2 h-4 w-4' />
          Edit User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openDialog('action', user, 'email')}>
          <Mail className='mr-2 h-4 w-4' />
          Send Email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => openDialog('action', user, 'role')}>
          <Shield className='mr-2 h-4 w-4' />
          Change Role
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            openDialog(
              'action',
              user,
              user.isActive ? 'deactivate' : 'activate'
            )
          }
        >
          {user.isActive ? (
            <>
              <UserX className='mr-2 h-4 w-4' />
              Deactivate
            </>
          ) : (
            <>
              <UserCheck className='mr-2 h-4 w-4' />
              Activate
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => openDialog('delete', user)}
          className='text-red-600'
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
