import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';
import { uploadSingle } from '~/utils/multer';

import FoodController from './food-controller';
import FoodValidationSchema from './food-validation';

const router: Router = express.Router();

router.get('/', asyncHandler(FoodController.find));

router.post(
  '/',
  uploadSingle('image'),
  validate(FoodValidationSchema.shape),
  asyncHandler(FoodController.create)
);

router.get('/:id', asyncHandler(FoodController.findById));

router.put(
  '/:id',
  uploadSingle('image'),
  validate(FoodValidationSchema.shape),
  asyncHandler(FoodController.update)
);

router.delete('/:id', asyncHandler(FoodController.remove));

export default router;
