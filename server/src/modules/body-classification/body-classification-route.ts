import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';

import BodyClassificationController from './body-classification-controller';
import BodyClassificationValidationSchema from './body-classification-validation';

const router: Router = express.Router();

router.get('/', asyncHandler(BodyClassificationController.findAll));

router.get('/:id', asyncHandler(BodyClassificationController.findById));

router.post(
  '/',
  validate(BodyClassificationValidationSchema.shape),
  asyncHandler(BodyClassificationController.create)
);

router.put(
  '/:id',
  validate(BodyClassificationValidationSchema.shape),
  asyncHandler(BodyClassificationController.update)
);

router.delete('/:id', asyncHandler(BodyClassificationController.remove));

export default router;
