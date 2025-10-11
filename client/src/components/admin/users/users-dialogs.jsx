'use client';

import React from 'react';

import { UsersActionDialog } from './users-action-dialog';
import { UsersDeleteDialog } from './users-delete-dialog';
import { UsersDetailsDialog } from './users-details-dialog';
import { UsersInviteDialog } from './users-invite-dialog';
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog';
import { useUsers } from './users-provider';

export function UsersDialogs() {
  const { dialogStates, activeUser, actionType, closeDialog, selectedUsers } =
    useUsers();

  return (
    <>
      <UsersInviteDialog
        open={dialogStates.invite}
        onOpenChange={open => !open && closeDialog('invite')}
      />

      <UsersDeleteDialog
        open={dialogStates.delete}
        onOpenChange={open => !open && closeDialog('delete')}
        user={activeUser}
      />

      <UsersMultiDeleteDialog
        open={dialogStates.multiDelete}
        onOpenChange={open => !open && closeDialog('multiDelete')}
        userIds={selectedUsers}
      />

      <UsersDetailsDialog
        open={dialogStates.details}
        onOpenChange={open => !open && closeDialog('details')}
        user={activeUser}
      />

      <UsersActionDialog
        open={dialogStates.action}
        onOpenChange={open => !open && closeDialog('action')}
        user={activeUser}
        actionType={actionType}
      />
    </>
  );
}
