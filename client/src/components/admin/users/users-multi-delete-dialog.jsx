'use client';

import { AlertTriangle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import { Alert } from '~/components/ui/alert';
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

export function UsersMultiDeleteDialog({ open, onOpenChange, userIds = [] }) {
  const dispatch = useDispatch();
  const { deleteLoading, deleteError, currentPage, limit, filters } =
    useSelector(state => state.users);
  const { closeDialog, setSelectedUsers } = useUsers();

  const handleDeleteMultiple = async () => {
    if (!userIds.length) return;

    try {
      // Delete users one by one (or implement batch delete in backend)
      for (const userId of userIds) {
        await dispatch(deleteUser(userId)).unwrap();
      }

      // Clear selection and refresh
      setSelectedUsers([]);
      dispatch(
        fetchUsers({
          page: currentPage,
          limit,
          search: filters.search,
          role: filters.role,
          gender: filters.gender
        })
      );
      closeDialog('multiDelete');
    } catch (error) {
      // Error is handled by the reducer
    }
  };

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      closeDialog('multiDelete');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-red-600' />
            Delete Multiple Users
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {userIds.length} selected user(s)?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className='my-4 p-4 border rounded-lg bg-muted/50'>
          <p className='text-sm'>
            <strong>{userIds.length}</strong> user(s) will be permanently
            deleted.
          </p>
        </div>

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
            onClick={handleDeleteMultiple}
            disabled={deleteLoading || userIds.length === 0}
          >
            {deleteLoading && <Spinner className='mr-2 h-4 w-4' />}
            Delete {userIds.length} User(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
