import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';
import { uploadSingle } from '~/utils/multer';

import ExerciseController from './exercise-controller';
import ExerciseValidationSchema from './exercise-validation';

const router: Router = express.Router();

router.get('/', asyncHandler(ExerciseController.findAll));

router.get('/:id', asyncHandler(ExerciseController.findById));

router.post(
  '/',
  uploadSingle('image'),
  validate(ExerciseValidationSchema.shape),
  asyncHandler(ExerciseController.create)
);

router.put(
  '/:id',
  uploadSingle('image'),
  validate(ExerciseValidationSchema.shape),
  asyncHandler(ExerciseController.update)
);

router.delete('/:id', asyncHandler(ExerciseController.remove));

export default router;
