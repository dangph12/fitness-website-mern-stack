import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu';
import { useFoodsContext } from './foods-provider';

export function FoodRowActions({ row }) {
  const food = row.original;
  const {
    setSelectedFood,
    setIsViewDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen
  } = useFoodsContext();

  const handleView = () => {
    setSelectedFood(food);
    setIsViewDialogOpen(true);
  };

  const handleEdit = () => {
    setSelectedFood(food);
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setSelectedFood(food);
    setIsDeleteDialogOpen(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={handleView}>
          <Eye className='mr-2 h-4 w-4' />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className='mr-2 h-4 w-4' />
          Edit Food
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className='text-destructive'>
          <Trash2 className='mr-2 h-4 w-4' />
          Delete Food
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
