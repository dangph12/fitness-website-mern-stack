import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { deleteFood } from '~/store/features/food-slice';

import { useFoodsContext } from './foods-provider';

export function FoodsDeleteDialog() {
  const dispatch = useDispatch();
  const {
    selectedFood,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    setSelectedFood
  } = useFoodsContext();

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setIsDeleteDialogOpen(false);
    setSelectedFood(null);
    setError('');
    setIsDeleting(false);
  };

  const handleDelete = async () => {
    if (!selectedFood) return;

    setIsDeleting(true);
    setError('');

    try {
      await dispatch(deleteFood(selectedFood._id)).unwrap();

      toast.success('Food deleted successfully!');

      handleClose();
    } catch (error) {
      const errorMessage = error.message || 'Failed to delete food';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!selectedFood) return null;

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <Trash2 className='h-5 w-5' />
            Delete Food
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the food
            item.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='flex items-center gap-2 p-3 bg-destructive/10 rounded-lg'>
            <AlertTriangle className='h-4 w-4 text-destructive' />
            <div>
              <p className='font-medium'>{selectedFood.title}</p>
              <p className='text-sm text-muted-foreground'>
                Category: {selectedFood.category}
              </p>
            </div>
          </div>

          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Delete Food
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
