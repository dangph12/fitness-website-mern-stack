import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';
import { uploadSingle } from '~/utils/multer';

import PlanController from './plan-controller';
import {
  CreatePlanValidationSchema,
  PlanValidationSchema
} from './plan-validation';

const router: Router = express.Router();

router.get('/', asyncHandler(PlanController.find));

router.get('/user/:userId', asyncHandler(PlanController.findByUser));

router.get('/:id', asyncHandler(PlanController.findById));

router.post(
  '/',
  uploadSingle('image'),
  validate(CreatePlanValidationSchema.shape),
  asyncHandler(PlanController.create)
);

router.put(
  '/:id',
  uploadSingle('image'),
  validate(CreatePlanValidationSchema.shape),
  asyncHandler(PlanController.update)
);

router.delete('/:id', asyncHandler(PlanController.remove));

export default router;
