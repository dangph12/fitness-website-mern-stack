import { Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '~/components/ui/button';

import { ExercisesDeleteDialog } from './exercises-delete-dialog';

export const ExercisesPrimaryButtons = ({ selectedExercises = [] }) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCreateExercise = () => {
    navigate('/admin/manage-exercises/create');
  };

  const handleBulkDelete = () => {
    setShowDeleteDialog(true);
  };

  return (
    <div className='flex items-center space-x-2'>
      {selectedExercises.length > 0 && (
        <Button
          variant='destructive'
          size='sm'
          onClick={handleBulkDelete}
          className='h-8'
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete ({selectedExercises.length})
        </Button>
      )}

      <Button onClick={handleCreateExercise} size='sm' className='h-8'>
        <Plus className='mr-2 h-4 w-4' />
        Create Exercise
      </Button>

      <ExercisesDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        exerciseIds={selectedExercises}
        isBulkDelete={true}
      />
    </div>
  );
};
