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
// import { ScrollArea } from '~/components/ui/scroll-area';
import { deleteFood } from '~/store/features/food-slice';

export function FoodsBulkDeleteDialog({
  open,
  onOpenChange,
  selectedFoods = []
}) {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    if (!isDeleting) {
      onOpenChange(false);
      setError('');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFoods.length === 0) return;

    setIsDeleting(true);
    setError('');

    try {
      // Delete tất cả - Redux sẽ tự update state
      await Promise.all(
        selectedFoods.map(food => dispatch(deleteFood(food._id)).unwrap())
      );

      toast.success(
        `Successfully deleted ${selectedFoods.length} food${selectedFoods.length > 1 ? 's' : ''}!`
      );

      handleClose();

      // KHÔNG cần fetch lại - Redux đã update state.foods.foods
    } catch (error) {
      const errorMessage = error.message || 'Failed to delete foods';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (selectedFoods.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <Trash2 className='h-5 w-5' />
            Delete Multiple Foods
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            <strong>{selectedFoods.length}</strong> food
            {selectedFoods.length > 1 ? 's' : ''}.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='flex items-center gap-2 p-3 bg-destructive/10 rounded-lg'>
            <AlertTriangle className='h-4 w-4 text-destructive flex-shrink-0' />
            <div className='flex-1'>
              <p className='font-medium'>
                {selectedFoods.length} food{selectedFoods.length > 1 ? 's' : ''}{' '}
                selected
              </p>
              <p className='text-sm text-muted-foreground'>
                All selected items will be permanently deleted
              </p>
            </div>
          </div>

          <div className='border rounded-lg'>
            <div className='h-[200px]'>
              <div className='p-3 space-y-2'>
                {selectedFoods.map((food, index) => (
                  <div
                    key={food._id || index}
                    className='flex items-center justify-between p-2 bg-muted/50 rounded'
                  >
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-sm truncate'>
                        {food.title}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {food.category} • {food.calories} cal
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
            onClick={handleBulkDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Delete {selectedFoods.length} Food
            {selectedFoods.length > 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
