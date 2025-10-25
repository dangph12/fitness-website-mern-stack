import React from 'react';

import { UsersDeleteDialog } from './users-delete-dialog';
import { UsersDetailsDialog } from './users-details-dialog';
import { useUsers } from './users-provider';

export const UsersDialogs = () => {
  const {
    isDetailsDialogOpen,
    isDeleteDialogOpen,
    selectedUser,
    setIsDetailsDialogOpen,
    setIsDeleteDialogOpen
  } = useUsers();

  return (
    <>
      <UsersDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
      <UsersDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
      />
    </>
  );
};
