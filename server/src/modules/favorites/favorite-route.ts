import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';

import FavoriteController from './favorite-controller';
import FavoriteValidationSchema from './favorite-validation';

const router: Router = express.Router();

router.post(
  '/:userId/items',
  validate(FavoriteValidationSchema.shape),
  asyncHandler(FavoriteController.addFavoriteItem)
);

router.get('/:userId', asyncHandler(FavoriteController.listByUser));

router.delete(
  '/:userId/items',
  validate(FavoriteValidationSchema.shape),
  asyncHandler(FavoriteController.removeFavoriteItem)
);

export default router;
