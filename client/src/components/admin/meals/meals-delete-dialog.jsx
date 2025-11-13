import { useState } from 'react';
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
import { deleteMeal } from '~/store/features/admin-meal-slice';

import { useMeals } from './meals-provider';

export function MealsDeleteDialog({
  open,
  onOpenChange,
  mealIds = [],
  mealTitle = '',
  isBulkDelete = false
}) {
  const dispatch = useDispatch();
  const { refreshData } = useMeals();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      if (isBulkDelete) {
        await Promise.all(mealIds.map(id => dispatch(deleteMeal(id)).unwrap()));
        toast.success(`${mealIds.length} meals deleted successfully`);
      } else {
        await dispatch(deleteMeal(mealIds[0])).unwrap();
        toast.success('Meal deleted successfully');
      }

      refreshData();
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete meal(s)');
    } finally {
      setLoading(false);
    }
  };

  const getDialogContent = () => {
    if (isBulkDelete) {
      return {
        title: `Delete ${mealIds.length} Meals`,
        description: `Are you sure you want to delete ${mealIds.length} selected meals? This action cannot be undone.`
      };
    } else {
      return {
        title: 'Delete Meal',
        description: `Are you sure you want to delete "${mealTitle}"? This action cannot be undone.`
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
}
