import React from 'react';

import { Badge } from '~/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { ScrollArea } from '~/components/ui/scroll-area';

export const WorkoutsDetailsDialog = ({ open, onOpenChange, workout }) => {
  if (!workout) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle>{workout.title}</DialogTitle>
          <DialogDescription>Workout Details</DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[70vh]'>
          <div className='space-y-4'>
            {workout.image && (
              <div>
                <img
                  src={workout.image}
                  alt={workout.title}
                  className='w-full h-48 object-cover rounded-lg'
                />
              </div>
            )}

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Status
                </p>
                <Badge
                  variant={workout.isPublic ? 'default' : 'secondary'}
                  className='mt-1'
                >
                  {workout.isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>

              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Creator
                </p>
                <p className='mt-1'>
                  {workout.user?.name || workout.user?.email || 'Unknown'}
                </p>
              </div>

              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Total Exercises
                </p>
                <p className='mt-1'>{workout.exercises?.length || 0}</p>
              </div>

              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Created At
                </p>
                <p className='mt-1'>
                  {new Date(workout.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <p className='text-sm font-medium text-muted-foreground mb-2'>
                Exercises
              </p>
              <div className='space-y-2'>
                {workout.exercises?.map((ex, index) => {
                  const exercise =
                    typeof ex.exercise === 'object'
                      ? ex.exercise
                      : { title: 'Exercise' };
                  return (
                    <div
                      key={index}
                      className='border rounded-lg p-3 flex items-start gap-3'
                    >
                      {exercise.tutorial && (
                        <img
                          src={exercise.tutorial}
                          alt={exercise.title}
                          className='w-16 h-16 object-cover rounded'
                        />
                      )}
                      <div className='flex-1'>
                        <p className='font-medium'>{exercise.title}</p>
                        <p className='text-sm text-muted-foreground'>
                          Sets: {ex.sets?.join(', ') || 'N/A'}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          Total Reps: {ex.sets?.reduce((a, b) => a + b, 0) || 0}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
