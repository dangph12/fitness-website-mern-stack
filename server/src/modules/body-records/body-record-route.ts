import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';

import BodyRecordController from './body-record-controller';
import BodyRecordValidationSchema from './body-record-validation';

const router: Router = express.Router();

router.get('/', asyncHandler(BodyRecordController.findAll));

router.post(
  '/',
  validate(BodyRecordValidationSchema.shape),
  asyncHandler(BodyRecordController.create)
);

router.get('/:id', asyncHandler(BodyRecordController.findById));

router.get('/user/:userId', asyncHandler(BodyRecordController.findByUser));

router.put(
  '/:id',
  validate(BodyRecordValidationSchema.shape),
  asyncHandler(BodyRecordController.update)
);

router.delete('/:id', asyncHandler(BodyRecordController.remove));

export default router;
