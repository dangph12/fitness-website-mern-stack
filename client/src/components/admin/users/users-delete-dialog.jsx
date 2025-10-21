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

export function UsersDeleteDialog({ open, onOpenChange, user }) {
  const dispatch = useDispatch();
  const { deleteLoading, deleteError, currentPage, limit, filters } =
    useSelector(state => state.users);
  const { closeDialog } = useUsers();

  // Helper function to get user display name
  const getUserDisplayName = user => {
    if (!user) return 'Unknown User';
    return user.name || user.fullName || user.username || 'Unknown User';
  };

  // Helper function to get user initials
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
    if (!user) return;

    try {
      await dispatch(deleteUser(user._id)).unwrap();
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
      // Error is handled by the reducer
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
            Delete User
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {user && (
          <div className='my-4 p-4 border rounded-lg bg-muted/50'>
            <div className='flex items-center space-x-3'>
              <Avatar className='h-10 w-10'>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
              </Avatar>
              <div>
                <div className='font-medium'>{getUserDisplayName(user)}</div>
                <div className='text-sm text-muted-foreground'>
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteError && <Alert variant='destructive'>{deleteError}</Alert>}

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
            disabled={deleteLoading || !user}
          >
            {deleteLoading && <Spinner className='mr-2 h-4 w-4' />}
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
