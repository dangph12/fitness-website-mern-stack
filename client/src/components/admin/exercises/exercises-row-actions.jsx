import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';

import { ExercisesDeleteDialog } from './exercises-delete-dialog';
import { ExercisesDetailsDialog } from './exercises-details-dialog';

export const ExercisesRowActions = ({ exercise }) => {
  const navigate = useNavigate();
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    navigate(`/admin/manage-exercises/update/${exercise._id}`);
  };

  const handleViewDetails = () => {
    setShowDetailsDialog(true);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className='mr-2 h-4 w-4' />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className='text-destructive'>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ExercisesDetailsDialog
        exercise={exercise}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />

      <ExercisesDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        exerciseIds={[exercise._id]}
        exerciseTitle={exercise.title}
      />
    </>
  );
};
