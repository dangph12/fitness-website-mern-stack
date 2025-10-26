import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';

import FavoriteController from './favorite-controller';
import FavoriteValidationSchema from './favorite-validation';

const router: Router = express.Router();

router.post(
  '/',
  validate(FavoriteValidationSchema.shape),
  asyncHandler(FavoriteController.addFavoriteItem)
);

router.get('/user/:userId', asyncHandler(FavoriteController.listByUser));

router.delete('/:favoriteId', asyncHandler(FavoriteController.remove));

export default router;
