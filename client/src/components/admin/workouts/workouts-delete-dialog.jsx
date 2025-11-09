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
import { deleteWorkout } from '~/store/features/workout-slice';

import { useWorkouts } from './workouts-provider';

export const WorkoutsDeleteDialog = ({
  open,
  onOpenChange,
  workoutIds = [],
  workoutTitle = '',
  isBulkDelete = false
}) => {
  const dispatch = useDispatch();
  const { refreshData } = useWorkouts();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      if (isBulkDelete) {
        // Delete multiple workouts
        await Promise.all(
          workoutIds.map(id => dispatch(deleteWorkout(id)).unwrap())
        );
        toast.success(`${workoutIds.length} workouts deleted successfully`);
      } else {
        // Delete single workout
        await dispatch(deleteWorkout(workoutIds[0])).unwrap();
        toast.success('Workout deleted successfully');
      }

      refreshData();
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete workout(s)');
    } finally {
      setLoading(false);
    }
  };

  const getDialogContent = () => {
    if (isBulkDelete) {
      return {
        title: `Delete ${workoutIds.length} Workouts`,
        description: `Are you sure you want to delete ${workoutIds.length} selected workouts? This action cannot be undone.`
      };
    } else {
      return {
        title: 'Delete Workout',
        description: `Are you sure you want to delete "${workoutTitle}"? This action cannot be undone.`
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
