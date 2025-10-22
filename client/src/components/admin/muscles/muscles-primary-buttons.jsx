import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '~/components/ui/button';

import { useMuscles } from './muscles-provider';

export const MusclesPrimaryButtons = ({ selectedMuscles = [] }) => {
  const { loading, openDeleteDialog, refreshData } = useMuscles();
  const navigate = useNavigate();

  const handleRefresh = () => {
    refreshData();
  };

  const handleBulkDelete = () => {
    if (selectedMuscles.length > 0) {
      // Pass array of IDs and count for bulk delete
      openDeleteDialog({
        _id: selectedMuscles,
        title: `${selectedMuscles.length} muscle${selectedMuscles.length > 1 ? 's' : ''}`,
        isBulkDelete: true
      });
    }
  };

  const handleCreate = () => {
    navigate('/admin/manage-muscles/create');
  };

  return (
    <div className='flex gap-2'>
      {selectedMuscles.length > 0 && (
        <Button variant='destructive' size='sm' onClick={handleBulkDelete}>
          <Trash2 className='h-4 w-4' />
          <span className='hidden sm:inline ml-2'>
            Delete ({selectedMuscles.length})
          </span>
        </Button>
      )}

      <Button
        variant='outline'
        size='sm'
        onClick={handleRefresh}
        disabled={loading}
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        <span className='hidden sm:inline ml-2'>Refresh</span>
      </Button>

      <Button size='sm' onClick={handleCreate}>
        <Plus className='h-4 w-4' />
        <span className='hidden sm:inline ml-2'>Add Muscle</span>
      </Button>
    </div>
  );
};
