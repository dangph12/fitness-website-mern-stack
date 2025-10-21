import React from 'react';
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
import { deleteExercise } from '~/store/features/exercise-slice';

import { useExercises } from './exercises-provider';

export const ExercisesDeleteDialog = ({
  open,
  onOpenChange,
  exerciseIds = [],
  exerciseTitle = '',
  isBulkDelete = false
}) => {
  const dispatch = useDispatch();
  const { refreshData } = useExercises();
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      if (isBulkDelete) {
        // Delete multiple exercises
        await Promise.all(
          exerciseIds.map(id => dispatch(deleteExercise(id)).unwrap())
        );
        toast.success(`${exerciseIds.length} exercises deleted successfully`);
      } else {
        // Delete single exercise
        await dispatch(deleteExercise(exerciseIds[0])).unwrap();
        toast.success('Exercise deleted successfully');
      }

      refreshData();
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete exercise(s)');
    } finally {
      setLoading(false);
    }
  };

  const getDialogContent = () => {
    if (isBulkDelete) {
      return {
        title: `Delete ${exerciseIds.length} Exercises`,
        description: `Are you sure you want to delete ${exerciseIds.length} selected exercises? This action cannot be undone.`
      };
    } else {
      return {
        title: 'Delete Exercise',
        description: `Are you sure you want to delete "${exerciseTitle}"? This action cannot be undone.`
      };
    }
  };

  const { title, description } = getDialogContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
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
