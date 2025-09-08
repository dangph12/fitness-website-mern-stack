import express, { Router } from 'express';

import authenticate from '~/middleware/authenticate';
import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';
import { uploadSingle } from '~/utils/multer';

import UserController from './user-controller';
import UserValidationSchema from './user-validation';

const router: Router = express.Router();

// In list method, you can implement pagination, sorting, and filtering logic
router.get('/', asyncHandler(UserController.find));

router.post(
  '/',
  validate(UserValidationSchema.shape),
  asyncHandler(UserController.create)
);

router.get('/:id', authenticate(), asyncHandler(UserController.findById));

// For update, because some fields are optional, we use partial validation
router.patch(
  '/:id',
  validate(UserValidationSchema.partial().shape),
  asyncHandler(UserController.update)
);

router.delete('/:id', asyncHandler(UserController.remove));

router.patch(
  '/:id/avatar',
  uploadSingle('avatar'),
  asyncHandler(UserController.updateAvatar)
);

export default router;
