'use client';

import { Mail, Trash2, UserCheck, UserX } from 'lucide-react';

import { Button } from '~/components/ui/button';

import { useUsers } from './users-provider';

export function DataTableBulkActions({ selectedCount }) {
  const { openDialog, selectedUsers } = useUsers();

  const handleBulkDelete = () => {
    openDialog('multiDelete');
  };

  const handleBulkEmail = () => {
    console.log('Send bulk email to users:', selectedUsers);
  };

  const handleBulkActivate = () => {
    console.log('Activate users:', selectedUsers);
  };

  const handleBulkDeactivate = () => {
    console.log('Deactivate users:', selectedUsers);
  };

  return (
    <div className='flex items-center space-x-2'>
      <span className='text-sm text-muted-foreground'>
        {selectedCount} row(s) selected
      </span>
      {/* <Button variant='outline' size='sm' onClick={handleBulkEmail}>
        <Mail className='mr-2 h-4 w-4' />
        Send Email
      </Button> */}
      <Button variant='outline' size='sm' onClick={handleBulkActivate}>
        <UserCheck className='mr-2 h-4 w-4' />
        Activate
      </Button>
      <Button variant='outline' size='sm' onClick={handleBulkDeactivate}>
        <UserX className='mr-2 h-4 w-4' />
        Deactivate
      </Button>
      <Button variant='destructive' size='sm' onClick={handleBulkDelete}>
        <Trash2 className='mr-2 h-4 w-4' />
        Delete
      </Button>
    </div>
  );
}
