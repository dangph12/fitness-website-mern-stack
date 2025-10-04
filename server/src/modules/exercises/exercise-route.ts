import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';
import { uploadSingle } from '~/utils/multer';

import ExerciseController from './exercise-controller';
import ExerciseValidationSchema from './exercise-validation';

const router: Router = express.Router();

router.get('/', asyncHandler(ExerciseController.find));

router.get('/:id', asyncHandler(ExerciseController.findById));

router.post(
  '/',
  uploadSingle('tutorial'),
  validate(ExerciseValidationSchema.shape),
  asyncHandler(ExerciseController.create)
);

router.put(
  '/:id',
  uploadSingle('tutorial'),
  validate(ExerciseValidationSchema.shape),
  asyncHandler(ExerciseController.update)
);

router.delete('/:id', asyncHandler(ExerciseController.remove));

export default router;
