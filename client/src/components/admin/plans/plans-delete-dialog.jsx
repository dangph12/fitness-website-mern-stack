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
import { deletePlan } from '~/store/features/plan-slice';

import { usePlans } from './plans-provider';

export function PlansDeleteDialog({
  open,
  onOpenChange,
  planIds = [],
  planTitle = '',
  isBulkDelete = false
}) {
  const dispatch = useDispatch();
  const { refreshData } = usePlans();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      if (isBulkDelete) {
        // Delete multiple plans
        await Promise.all(planIds.map(id => dispatch(deletePlan(id)).unwrap()));
        toast.success(`${planIds.length} plans deleted successfully`);
      } else {
        // Delete single plan
        await dispatch(deletePlan(planIds[0])).unwrap();
        toast.success('Plan deleted successfully');
      }

      refreshData();
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete plan(s)');
    } finally {
      setLoading(false);
    }
  };

  const getDialogContent = () => {
    if (isBulkDelete) {
      return {
        title: `Delete ${planIds.length} Plans`,
        description: `Are you sure you want to delete ${planIds.length} selected plans? This action cannot be undone and will remove all associated workouts.`
      };
    } else {
      return {
        title: 'Delete Plan',
        description: `Are you sure you want to delete "${planTitle}"? This action cannot be undone and will remove all associated workouts.`
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
