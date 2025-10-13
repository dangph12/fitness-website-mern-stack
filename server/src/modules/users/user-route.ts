import express, { Router } from 'express';

import authenticate from '~/middleware/authenticate';
import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';
import { uploadSingle } from '~/utils/multer';

import UserController from './user-controller';
import UserValidationSchema, { OnboardingValidation } from './user-validation';

const router: Router = express.Router();

router.get('/', asyncHandler(UserController.find));

router.post(
  '/',
  uploadSingle('avatar'),
  validate(UserValidationSchema.shape),
  asyncHandler(UserController.create)
);

router.get('/:id', authenticate(), asyncHandler(UserController.findById));

router.get(
  '/email/:email',
  authenticate(),
  asyncHandler(UserController.findByEmail)
);

router.put(
  '/:id',
  uploadSingle('avatar'),
  validate(UserValidationSchema.shape),
  asyncHandler(UserController.update)
);

router.delete('/:id', asyncHandler(UserController.remove));

router.patch(
  '/:id/avatar',
  uploadSingle('avatar'),
  asyncHandler(UserController.updateAvatar)
);

router.put(
  '/onboarding',
  authenticate(),
  validate(OnboardingValidation.shape),
  asyncHandler(UserController.completeOnboarding)
);

export default router;
