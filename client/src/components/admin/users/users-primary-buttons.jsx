'use client';

import { Download, Plus, Upload } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';

import { Button } from '~/components/ui/button';

import { useUsers } from './users-provider';

export function UsersPrimaryButtons() {
  const navigate = useNavigate();
  const { openDialog } = useUsers();

  const handleAddUser = () => {
    navigate('/admin/manage-users/create');
  };

  const handleInviteUser = () => {
    openDialog('invite');
  };

  const handleImportUsers = () => {
    // TODO: Implement import functionality
    console.log('Import users');
  };

  const handleExportUsers = () => {
    // TODO: Implement export functionality
    console.log('Export users');
  };

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={handleAddUser} className='flex items-center gap-2'>
        <Plus className='h-4 w-4' />
        Create User
      </Button>

      {/* <Button
        variant='outline'
        onClick={handleInviteUser}
        className='flex items-center gap-2'
      >
        <Upload className='h-4 w-4' />
        Invite User
      </Button> */}
    </div>
  );
}
