import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';

import MuscleController from './muscle-controller';
import MuscleValidationSchema from './muscle-validation';

const router: Router = express.Router();

router.get('/', asyncHandler(MuscleController.findAll));

router.get('/:id', asyncHandler(MuscleController.findById));

router.post(
  '/',
  validate(MuscleValidationSchema.shape),
  asyncHandler(MuscleController.create)
);

router.put(
  '/',
  validate(MuscleValidationSchema.shape),
  asyncHandler(MuscleController.update)
);

router.delete('/:id', asyncHandler(MuscleController.remove));

export default router;
