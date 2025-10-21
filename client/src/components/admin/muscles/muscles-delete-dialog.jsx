import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { deleteMuscle } from '~/store/features/muscles-slice';

import { useMuscles } from './muscles-provider';

export const MusclesDeleteDialog = () => {
  const dispatch = useDispatch();
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedMuscle,
    closeAllDialogs,
    refreshData,
    setSelectedMuscles
  } = useMuscles();
  const [loading, setLoading] = useState(false);

  // Check if it's bulk delete
  const isBulkDelete = selectedMuscle?.isBulkDelete || false;
  const muscleIds = isBulkDelete
    ? selectedMuscle._id
    : [selectedMuscle?._id].filter(Boolean);

  const handleDelete = async () => {
    if (!muscleIds.length) return;

    setLoading(true);

    try {
      if (isBulkDelete) {
        // Delete multiple muscles
        const deletePromises = muscleIds.map(id =>
          dispatch(deleteMuscle(id)).unwrap()
        );
        await Promise.all(deletePromises);
        toast.success(`${muscleIds.length} muscle(s) deleted successfully`);
      } else {
        // Delete single muscle
        await dispatch(deleteMuscle(muscleIds[0])).unwrap();
        toast.success('Muscle deleted successfully');
      }

      // Always clear selection after any delete
      setSelectedMuscles([]);

      closeAllDialogs();
      refreshData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete muscle(s)');
    } finally {
      setLoading(false);
    }
  };

  const getDialogContent = () => {
    if (isBulkDelete) {
      return {
        title: `Delete ${muscleIds.length} Muscle${muscleIds.length > 1 ? 's' : ''}`,
        description: `Are you sure you want to delete ${muscleIds.length} selected muscle${muscleIds.length > 1 ? 's' : ''}? This action cannot be undone.`
      };
    }
    return {
      title: 'Delete Muscle',
      description: `Are you sure you want to delete "${selectedMuscle?.title}"? This action cannot be undone.`
    };
  };

  const { title, description } = getDialogContent();

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
