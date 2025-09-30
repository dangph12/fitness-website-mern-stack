import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';

import EquipmentController from './equipment-controller';
import EquipmentValidationSchema from './equipment-validation';

const router: Router = express.Router();

// Get All Equipments
router.get('/', asyncHandler(EquipmentController.findAll));

// Create Equipment
router.post(
  '/',
  validate(EquipmentValidationSchema.shape),
  asyncHandler(EquipmentController.create)
);

// Get a single equipment by ID
router.get('/:id', asyncHandler(EquipmentController.findById));

// Update equipment, because some fields are optional, we use partial validation
router.put(
  '/:id',
  validate(EquipmentValidationSchema.partial().shape),
  asyncHandler(EquipmentController.update)
);

// Delete equipment
router.delete('/:id', asyncHandler(EquipmentController.remove));

export default router;
