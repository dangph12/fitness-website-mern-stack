import React from 'react';

import { WorkoutsActionDialog } from './workouts-action-dialog';
import { WorkoutsDeleteDialog } from './workouts-delete-dialog';
import { WorkoutsDetailsDialog } from './workouts-details-dialog';
import { useWorkouts } from './workouts-provider';

export const WorkoutsDialogs = () => {
  const {
    actionDialogOpen,
    deleteDialogOpen,
    detailsDialogOpen,
    currentWorkout,
    dialogMode,
    deleteMode,
    closeAllDialogs
  } = useWorkouts();

  return (
    <>
      <WorkoutsActionDialog
        open={actionDialogOpen}
        onOpenChange={open => !open && closeAllDialogs()}
        workout={currentWorkout}
        mode={dialogMode}
      />

      <WorkoutsDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={open => !open && closeAllDialogs()}
        workoutIds={deleteMode.workoutIds}
        workoutTitle={deleteMode.workoutTitle}
        isBulkDelete={deleteMode.isBulk}
      />

      <WorkoutsDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={open => !open && closeAllDialogs()}
        workout={currentWorkout}
      />
    </>
  );
};
