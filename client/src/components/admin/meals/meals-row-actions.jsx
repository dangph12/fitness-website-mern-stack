import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';

import { MealsDeleteDialog } from './meals-delete-dialog';
import { MealsDetailsDialog } from './meals-details-dialog';

export function MealsRowActions({ row }) {
  const meal = row.original;
  const navigate = useNavigate();
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    navigate(`/admin/manage-meals/update/${meal._id}`);
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
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className='mr-2 h-4 w-4' />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className='text-destructive focus:text-destructive'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MealsDetailsDialog
        meal={meal}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />

      <MealsDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        mealIds={[meal._id]}
        mealTitle={meal.title}
        isBulkDelete={false}
      />
    </>
  );
}
