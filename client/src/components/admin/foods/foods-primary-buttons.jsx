import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { deleteFood } from '~/store/features/food-slice';

import { FoodsBulkDeleteDialog } from './foods-bulk-delete-dialog';

export function FoodsPrimaryButtons({ selectedFoods = [] }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  const handleCreateFood = () => {
    navigate('/admin/manage-foods/create');
  };

  const handleBulkDelete = () => {
    setShowBulkDelete(true);
  };

  return (
    <div className='flex items-center gap-2'>
      {selectedFoods.length > 0 && (
        <Button
          variant='destructive'
          size='sm'
          onClick={handleBulkDelete}
          className='h-8'
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete ({selectedFoods.length})
        </Button>
      )}

      <Button onClick={handleCreateFood} size='sm' className='h-8'>
        <Plus className='mr-2 h-4 w-4' />
        Create Food
      </Button>

      <FoodsBulkDeleteDialog
        open={showBulkDelete}
        onOpenChange={setShowBulkDelete}
        selectedFoods={selectedFoods}
      />
    </div>
  );
}
