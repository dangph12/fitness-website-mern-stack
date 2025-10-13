import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';
import { uploadSingle } from '~/utils/multer';

import WorkoutController from './workout-controller';
import WorkoutValidationSchema from './workout-validation';

const router: Router = express.Router();

router.get('/filter', asyncHandler(WorkoutController.find));

router.get('/', asyncHandler(WorkoutController.findAll));

router.get('/user/:userId', asyncHandler(WorkoutController.findByUser));

router.get('/:id', asyncHandler(WorkoutController.findById));

router.post(
  '/',
  uploadSingle('image'),
  validate(WorkoutValidationSchema.shape),
  asyncHandler(WorkoutController.create)
);

router.put(
  '/:id',
  uploadSingle('image'),
  validate(WorkoutValidationSchema.shape),
  asyncHandler(WorkoutController.update)
);

router.delete('/:id', asyncHandler(WorkoutController.remove));

export default router;
