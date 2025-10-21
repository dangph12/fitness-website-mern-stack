import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../../ui/dialog';
import { useFoodsContext } from './foods-provider';

export function FoodsDetailsDialog() {
  const { selectedFood, isViewDialogOpen, setIsViewDialogOpen } =
    useFoodsContext();

  if (!selectedFood) return null;

  return (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Food Details</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-20 w-20'>
              <AvatarImage src={selectedFood.image} alt={selectedFood.title} />
              <AvatarFallback className='text-lg'>
                {selectedFood.title?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className='text-xl font-semibold'>{selectedFood.title}</h3>
              <Badge variant='outline' className='mt-1'>
                {selectedFood.category}
              </Badge>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h4 className='font-semibold text-lg'>Nutritional Information</h4>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Calories:</span>
                  <span className='font-medium'>{selectedFood.calories}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Protein:</span>
                  <span className='font-medium'>{selectedFood.protein}g</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Fat:</span>
                  <span className='font-medium'>{selectedFood.fat}g</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Carbohydrates:</span>
                  <span className='font-medium'>
                    {selectedFood.carbohydrate}g
                  </span>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <h4 className='font-semibold text-lg'>Additional Info</h4>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Unit:</span>
                  <span className='font-medium'>{selectedFood.unit}g</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Created:</span>
                  <span className='font-medium'>
                    {new Date(selectedFood.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Updated:</span>
                  <span className='font-medium'>
                    {new Date(selectedFood.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
