import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';

import GoalController from './goal-controller';
import GoalValidationSchema from './goal-validation';

const router: Router = express.Router();

router.get('/', asyncHandler(GoalController.findAll));

router.post(
  '/',
  validate(GoalValidationSchema.shape),
  asyncHandler(GoalController.create)
);

router.get('/user/:userId', asyncHandler(GoalController.findByUser));

router.get('/:id', asyncHandler(GoalController.findById));

router.put(
  '/:id',
  validate(GoalValidationSchema.shape),
  asyncHandler(GoalController.update)
);

router.delete('/:id', asyncHandler(GoalController.remove));

export default router;
