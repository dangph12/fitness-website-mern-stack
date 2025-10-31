import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';
import { uploadMultiple, uploadSingle } from '~/utils/multer';

import MealController from './meal-controller';
import {
  MealValidationSchema,
  MultipleMealsUpdateValidationSchema,
  MultipleMealsValidationSchema
} from './meal-validation';

const router: Router = express.Router();

router.get('/', asyncHandler(MealController.find));

router.get('/admin', asyncHandler(MealController.findByAdmin));

router.get('/:id', asyncHandler(MealController.findById));

router.post(
  '/',
  uploadSingle('image'),
  validate(MealValidationSchema.shape),
  asyncHandler(MealController.create)
);

router.post(
  '/multiple',
  uploadMultiple('images', 10),
  validate(MultipleMealsValidationSchema.shape),
  asyncHandler(MealController.createMultiple)
);

router.put(
  '/multiple',
  uploadMultiple('images', 10),
  validate(MultipleMealsUpdateValidationSchema.shape),
  asyncHandler(MealController.updateMultiple)
);

router.put(
  '/:id',
  uploadSingle('image'),
  validate(MealValidationSchema.shape),
  asyncHandler(MealController.update)
);

router.delete('/:id', asyncHandler(MealController.remove));

export default router;
