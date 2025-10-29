import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '~/components/ui/button';

import { PlansDeleteDialog } from './plans-delete-dialog';
import { usePlans } from './plans-provider';

export function PlansPrimaryButtons() {
  const navigate = useNavigate();
  const { selectedPlans } = usePlans();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCreatePlan = () => {
    navigate('/admin/manage-plans/create');
  };

  const handleBulkDelete = () => {
    setShowDeleteDialog(true);
  };

  return (
    <div className='flex items-center gap-2'>
      {selectedPlans.length > 0 && (
        <Button
          variant='destructive'
          size='sm'
          onClick={handleBulkDelete}
          className='h-8'
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete ({selectedPlans.length})
        </Button>
      )}

      <Button onClick={handleCreatePlan} size='sm' className='h-8'>
        <Plus className='mr-2 h-4 w-4' />
        Create Plan
      </Button>

      <PlansDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        planIds={selectedPlans}
        isBulkDelete={true}
      />
    </div>
  );
}
