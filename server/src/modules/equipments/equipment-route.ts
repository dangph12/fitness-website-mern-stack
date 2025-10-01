import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';
import { uploadSingle } from '~/utils/multer';

import EquipmentController from './equipment-controller';
import EquipmentValidationSchema from './equipment-validation';

const router: Router = express.Router();

router.get('/', asyncHandler(EquipmentController.findAll));

router.post(
  '/',
  uploadSingle('image'),
  validate(EquipmentValidationSchema.shape),
  asyncHandler(EquipmentController.create)
);

router.get('/:id', asyncHandler(EquipmentController.findById));

router.put(
  '/:id',
  uploadSingle('image'),
  validate(EquipmentValidationSchema.shape),
  asyncHandler(EquipmentController.update)
);

router.delete('/:id', asyncHandler(EquipmentController.remove));

export default router;
