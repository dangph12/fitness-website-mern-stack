'use client';

import { AlertTriangle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import { Alert } from '~/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Spinner } from '~/components/ui/spinner';
import { deleteUser, fetchUsers } from '~/store/features/users-slice';

import { useUsers } from './users-provider';

export function UsersDeleteDialog({ open, onOpenChange }) {
  const dispatch = useDispatch();
  const { deleteLoading, deleteError, currentPage, limit, filters } =
    useSelector(state => state.users);
  const {
    closeDialog,
    selectedUser,
    selectedUsers,
    deleteMode,
    setSelectedUsers
  } = useUsers();

  const isBulkDelete = deleteMode === 'bulk';
  const usersToDelete = isBulkDelete
    ? selectedUsers
    : [selectedUser?._id].filter(Boolean);

  // Helper functions
  const getUserDisplayName = user => {
    if (!user) return 'Unknown User';
    return user.name || user.fullName || user.username || 'Unknown User';
  };

  const getUserInitials = user => {
    if (!user) return 'U';
    const name = getUserDisplayName(user);
    if (name === 'Unknown User') return 'U';

    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDelete = async () => {
    if (usersToDelete.length === 0) return;

    try {
      // Delete all selected users
      await Promise.all(
        usersToDelete.map(userId => dispatch(deleteUser(userId)).unwrap())
      );

      // Clear selection
      if (isBulkDelete) {
        setSelectedUsers([]);
      }

      // Refresh the users list
      dispatch(
        fetchUsers({
          page: currentPage,
          limit,
          search: filters.search,
          role: filters.role,
          gender: filters.gender
        })
      );

      closeDialog('delete');
    } catch (error) {
      console.error('❌ Delete user error:', error);
    }
  };

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      closeDialog('delete');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-red-600' />
            Delete {isBulkDelete ? 'Users' : 'User'}
          </DialogTitle>
          <DialogDescription>
            {isBulkDelete
              ? `Are you sure you want to delete ${usersToDelete.length} user(s)? This action cannot be undone.`
              : 'Are you sure you want to delete this user? This action cannot be undone.'}
          </DialogDescription>
        </DialogHeader>

        {!isBulkDelete && selectedUser && (
          <div className='my-4 p-4 border rounded-lg bg-muted/50'>
            <div className='flex items-center space-x-3'>
              <Avatar className='h-10 w-10'>
                <AvatarImage src={selectedUser.avatar} />
                <AvatarFallback>{getUserInitials(selectedUser)}</AvatarFallback>
              </Avatar>
              <div>
                <div className='font-medium'>
                  {getUserDisplayName(selectedUser)}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {selectedUser.email}
                </div>
              </div>
            </div>
          </div>
        )}

        {isBulkDelete && (
          <div className='my-4 p-4 border rounded-lg bg-muted/50'>
            <p className='text-sm font-medium'>
              {usersToDelete.length} user(s) will be deleted
            </p>
          </div>
        )}

        {!isBulkDelete && !selectedUser && (
          <div className='my-4 p-4 border rounded-lg bg-muted/50 text-center text-muted-foreground'>
            No user selected
          </div>
        )}

        {deleteError && (
          <Alert variant='destructive' className='my-4'>
            {deleteError}
          </Alert>
        )}

        <DialogFooter>
          <Button
            variant='outline'
            onClick={handleClose}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteLoading || usersToDelete.length === 0}
          >
            {deleteLoading && <Spinner className='mr-2 h-4 w-4' />}
            Delete {isBulkDelete ? `${usersToDelete.length} User(s)` : 'User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
