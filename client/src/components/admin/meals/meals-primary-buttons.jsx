import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '~/components/ui/button';

import { MealsDeleteDialog } from './meals-delete-dialog';
import { useMeals } from './meals-provider';

export function MealsPrimaryButtons() {
  const navigate = useNavigate();
  const { selectedMeals } = useMeals();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCreateMeal = () => {
    navigate('/admin/manage-meals/create');
  };

  const handleBulkDelete = () => {
    setShowDeleteDialog(true);
  };

  return (
    <div className='flex items-center gap-2'>
      {selectedMeals.length > 0 && (
        <Button
          variant='destructive'
          size='sm'
          onClick={handleBulkDelete}
          className='h-8'
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete ({selectedMeals.length})
        </Button>
      )}

      <Button onClick={handleCreateMeal} size='sm' className='h-8'>
        <Plus className='mr-2 h-4 w-4' />
        Create Meal
      </Button>

      <MealsDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        mealIds={selectedMeals}
        isBulkDelete={true}
      />
    </div>
  );
}
