import { format } from 'date-fns';
import { Calendar, Clock, Dumbbell, Eye, EyeOff, User } from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';

export function PlansDetailsDialog({ plan, open, onOpenChange }) {
  if (!plan) return null;

  const totalExercises =
    plan.workouts?.reduce((acc, workout) => {
      return acc + (workout.exercises?.length || 0);
    }, 0) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Plan Details</DialogTitle>
          <DialogDescription>
            Complete information about the training plan
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[calc(90vh-120px)]'>
          <div className='space-y-6 pr-4'>
            {/* Plan Image */}
            {plan.image && (
              <div className='relative w-full h-64 rounded-lg overflow-hidden border'>
                <img
                  src={plan.image}
                  alt={plan.title}
                  className='w-full h-full object-cover'
                />
                <div className='absolute top-3 right-3'>
                  <Badge
                    variant={plan.isPublic ? 'default' : 'secondary'}
                    className='shadow-lg'
                  >
                    {plan.isPublic ? (
                      <>
                        <Eye className='h-3 w-3 mr-1' />
                        Public
                      </>
                    ) : (
                      <>
                        <EyeOff className='h-3 w-3 mr-1' />
                        Private
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className='space-y-3'>
              <div>
                <h3 className='text-2xl font-bold'>{plan.title}</h3>
                <p className='text-sm text-muted-foreground mt-2'>
                  {plan.description || 'No description provided'}
                </p>
              </div>
            </div>

            <Separator />

            {/* Statistics Cards */}
            <div className='grid grid-cols-3 gap-4'>
              <div className='p-4 border rounded-lg bg-card'>
                <div className='flex items-center gap-2 mb-2'>
                  <Dumbbell className='h-4 w-4 text-primary' />
                  <p className='text-xs font-medium text-muted-foreground'>
                    Total Workouts
                  </p>
                </div>
                <p className='text-2xl font-bold'>
                  {plan.workouts?.length || 0}
                </p>
              </div>

              <div className='p-4 border rounded-lg bg-card'>
                <div className='flex items-center gap-2 mb-2'>
                  <Dumbbell className='h-4 w-4 text-primary' />
                  <p className='text-xs font-medium text-muted-foreground'>
                    Total Exercises
                  </p>
                </div>
                <p className='text-2xl font-bold'>{totalExercises}</p>
              </div>

              <div className='p-4 border rounded-lg bg-card'>
                <div className='flex items-center gap-2 mb-2'>
                  {plan.isPublic ? (
                    <Eye className='h-4 w-4 text-green-600' />
                  ) : (
                    <EyeOff className='h-4 w-4 text-gray-600' />
                  )}
                  <p className='text-xs font-medium text-muted-foreground'>
                    Status
                  </p>
                </div>
                <Badge
                  variant={plan.isPublic ? 'default' : 'secondary'}
                  className='text-sm'
                >
                  {plan.isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Workouts List */}
            <div className='space-y-3'>
              <h4 className='font-semibold flex items-center gap-2'>
                <Dumbbell className='h-4 w-4' />
                Workouts ({plan.workouts?.length || 0})
              </h4>

              {plan.workouts && plan.workouts.length > 0 ? (
                <div className='space-y-3'>
                  {plan.workouts.map((workout, index) => (
                    <div
                      key={workout._id || index}
                      className='p-4 border rounded-lg hover:bg-muted/50 transition-colors'
                    >
                      <div className='flex items-start gap-4'>
                        {/* Workout Image */}
                        <div className='relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border'>
                          {workout.image ? (
                            <img
                              src={workout.image}
                              alt={workout.title}
                              className='h-full w-full object-cover'
                            />
                          ) : (
                            <div className='h-full w-full bg-muted flex items-center justify-center'>
                              <Dumbbell className='h-6 w-6 text-muted-foreground' />
                            </div>
                          )}
                        </div>

                        {/* Workout Info */}
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between gap-2 mb-2'>
                            <div>
                              <p className='font-semibold text-base'>
                                {index + 1}. {workout.title}
                              </p>
                            </div>
                            <Badge
                              variant={
                                workout.isPublic ? 'default' : 'secondary'
                              }
                              className='flex-shrink-0'
                            >
                              {workout.isPublic ? 'Public' : 'Private'}
                            </Badge>
                          </div>

                          {/* Exercises in Workout */}
                          {workout.exercises &&
                            workout.exercises.length > 0 && (
                              <div className='mt-3 space-y-2'>
                                <p className='text-xs font-medium text-muted-foreground'>
                                  Exercises ({workout.exercises.length})
                                </p>
                                <div className='space-y-2'>
                                  {workout.exercises.map(
                                    (exercise, exIndex) => (
                                      <div
                                        key={exercise._id || exIndex}
                                        className='flex items-center gap-3 p-2 bg-muted/50 rounded-md'
                                      >
                                        {/* Exercise Image */}
                                        {exercise.exercise?.image && (
                                          <img
                                            src={exercise.exercise.image}
                                            alt={exercise.exercise.title}
                                            className='h-12 w-12 object-cover rounded border'
                                          />
                                        )}

                                        <div className='flex-1 min-w-0'>
                                          <p className='text-sm font-medium truncate'>
                                            {exIndex + 1}.{' '}
                                            {exercise.exercise?.title ||
                                              'Exercise'}
                                          </p>
                                        </div>

                                        {/* Muscles & Equipment */}
                                        <div className='flex flex-col gap-1 text-xs'>
                                          {exercise.exercise?.muscles &&
                                            exercise.exercise.muscles.length >
                                              0 && (
                                              <div className='flex flex-wrap gap-1'>
                                                {exercise.exercise.muscles.map(
                                                  muscle => (
                                                    <Badge
                                                      key={muscle._id}
                                                      variant='outline'
                                                      className='text-xs'
                                                    >
                                                      {muscle.name}
                                                    </Badge>
                                                  )
                                                )}
                                              </div>
                                            )}
                                          {exercise.exercise?.equipments &&
                                            exercise.exercise.equipments
                                              .length > 0 && (
                                              <div className='flex flex-wrap gap-1'>
                                                {exercise.exercise.equipments.map(
                                                  equipment => (
                                                    <Badge
                                                      key={equipment._id}
                                                      variant='secondary'
                                                      className='text-xs'
                                                    >
                                                      {equipment.name}
                                                    </Badge>
                                                  )
                                                )}
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground'>
                  <Dumbbell className='h-12 w-12 mx-auto mb-2 opacity-50' />
                  <p>No workouts added to this plan</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Timestamps */}
            <div className='space-y-3'>
              <h4 className='font-semibold flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                Timeline
              </h4>
              <div className='grid grid-cols-2 gap-4'>
                <div className='p-3 border rounded-lg bg-muted/30'>
                  <div className='flex items-center gap-2 mb-1'>
                    <Clock className='h-3 w-3 text-muted-foreground' />
                    <p className='text-xs font-medium text-muted-foreground'>
                      Created At
                    </p>
                  </div>
                  <p className='text-sm font-medium'>
                    {plan.createdAt
                      ? format(new Date(plan.createdAt), 'PPP')
                      : 'N/A'}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {plan.createdAt
                      ? format(new Date(plan.createdAt), 'p')
                      : ''}
                  </p>
                </div>

                <div className='p-3 border rounded-lg bg-muted/30'>
                  <div className='flex items-center gap-2 mb-1'>
                    <Clock className='h-3 w-3 text-muted-foreground' />
                    <p className='text-xs font-medium text-muted-foreground'>
                      Updated At
                    </p>
                  </div>
                  <p className='text-sm font-medium'>
                    {plan.updatedAt
                      ? format(new Date(plan.updatedAt), 'PPP')
                      : 'N/A'}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {plan.updatedAt
                      ? format(new Date(plan.updatedAt), 'p')
                      : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
