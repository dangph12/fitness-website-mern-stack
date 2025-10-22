import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';

import { useMuscles } from './muscles-provider';

export const MusclesDetailsDialog = () => {
  const { isDetailsDialogOpen, setIsDetailsDialogOpen, selectedMuscle } =
    useMuscles();

  if (!selectedMuscle) return null;

  return (
    <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Muscle Details</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-24 w-24'>
              <AvatarImage
                src={selectedMuscle.image}
                alt={selectedMuscle.title}
              />
              <AvatarFallback>{selectedMuscle.title?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className='text-2xl font-bold'>{selectedMuscle.title}</h3>
              {/* <p className="text-sm text-muted-foreground">ID: {selectedMuscle._id}</p> */}
            </div>
          </div>

          <div className='grid gap-4'>
            <div className='grid grid-cols-2 gap-2'>
              <div className='text-sm font-medium'>Created At:</div>
              <div className='text-sm text-muted-foreground'>
                {new Date(selectedMuscle.createdAt).toLocaleString()}
              </div>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <div className='text-sm font-medium'>Updated At:</div>
              <div className='text-sm text-muted-foreground'>
                {new Date(selectedMuscle.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
