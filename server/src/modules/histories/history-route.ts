import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';

import HistoryController from './history-controller';
import HistoryValidationSchema from './history-validation';

const router: Router = express.Router();

router.get('/user/:userId', asyncHandler(HistoryController.listByUser));

router.post(
  '/user/:userId',
  validate(HistoryValidationSchema.shape),
  asyncHandler(HistoryController.addToHistory)
);

router.delete('/:id', asyncHandler(HistoryController.removeFromHistory));

export default router;
