import React from 'react';

import { MusclesActionDialog } from './muscles-action-dialog';
import { MusclesDeleteDialog } from './muscles-delete-dialog';
import { MusclesDetailsDialog } from './muscles-details-dialog';

export const MusclesDialogs = () => {
  return (
    <>
      <MusclesDeleteDialog />
      <MusclesDetailsDialog />
    </>
  );
};
