import express, { Router } from 'express';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';

import MuscleController from './muscle-controller';
import MuscleValidationSchema from './muscle-validation';

const router: Router = express.Router();

// Get a single food
router.get('/:id', asyncHandler(MuscleController.findById));

export default router;
