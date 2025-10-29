import { Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '~/components/ui/button';

import { useWorkouts } from './workouts-provider';

export function WorkoutsPrimaryButtons({ selectedWorkouts = [] }) {
  const navigate = useNavigate();
  const { openBulkDeleteDialog } = useWorkouts();

  const handleCreateWorkout = () => {
    navigate('/admin/manage-workouts/create');
  };

  return (
    <div className='flex items-center gap-2'>
      {selectedWorkouts.length > 0 && (
        <Button
          onClick={() => openBulkDeleteDialog(selectedWorkouts)}
          variant='destructive'
          size='sm'
          className='h-8'
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete ({selectedWorkouts.length})
        </Button>
      )}
      <Button onClick={handleCreateWorkout} size='sm' className='h-8'>
        <Plus className='mr-2 h-4 w-4' />
        Create Workout
      </Button>
    </div>
  );
}
