import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';

import FoodController from './food-controller';
import FoodValidationSchema from './food-validation';

const router: Router = express.Router();

// Get All Foods
router.get('/', asyncHandler(FoodController.find));

// Create Food
router.post(
  '/',
  validate(FoodValidationSchema.shape),
  asyncHandler(FoodController.create)
);

// Get a single food
router.get('/:id', asyncHandler(FoodController.findById));

// Update food, because some fields are optional, we use partial validation
router.patch(
  '/:id',
  validate(FoodValidationSchema.partial().shape),
  asyncHandler(FoodController.update)
);

// Delete food
router.delete('/:id', asyncHandler(FoodController.remove));

export default router;
