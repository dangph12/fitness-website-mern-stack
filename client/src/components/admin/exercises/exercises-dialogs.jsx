import React from 'react';

import { ExercisesActionDialog } from './exercises-action-dialog';
import { ExercisesDeleteDialog } from './exercises-delete-dialog';
import { ExercisesDetailsDialog } from './exercises-details-dialog';

export const ExercisesDialogs = ({
  // Action Dialog
  actionDialogOpen,
  setActionDialogOpen,
  actionDialogMode,
  actionDialogExercise,

  // Details Dialog
  detailsDialogOpen,
  setDetailsDialogOpen,
  detailsDialogExercise,

  // Delete Dialog
  deleteDialogOpen,
  setDeleteDialogOpen,
  deleteDialogExerciseIds,
  deleteDialogExerciseTitle,
  deleteDialogIsBulk
}) => {
  return (
    <>
      <ExercisesActionDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        mode={actionDialogMode}
        exercise={actionDialogExercise}
      />

      <ExercisesDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        exercise={detailsDialogExercise}
      />

      <ExercisesDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        exerciseIds={deleteDialogExerciseIds}
        exerciseTitle={deleteDialogExerciseTitle}
        isBulkDelete={deleteDialogIsBulk}
      />
    </>
  );
};
