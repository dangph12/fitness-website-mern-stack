import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';
import { uploadSingle } from '~/utils/multer';

import MealController from './meal-controller';
import MealValidationSchema from './meal-validation';

const router: Router = express.Router();

router.get('/', asyncHandler(MealController.find));

router.get('/:id', asyncHandler(MealController.findById));

router.post(
  '/',
  uploadSingle('image'),
  validate(MealValidationSchema.shape),
  asyncHandler(MealController.create)
);

router.put(
  '/:id',
  uploadSingle('image'),
  validate(MealValidationSchema.shape),
  asyncHandler(MealController.update)
);

router.delete('/:id', asyncHandler(MealController.remove));

export default router;
