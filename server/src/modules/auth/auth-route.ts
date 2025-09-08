import express, { Router } from 'express';
import passport from 'passport';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';
import { uploadSingle } from '~/utils/multer';

import AuthController from './auth-controller';
import {
  ForgotPassword,
  LocalLogin,
  LocalSignUp,
  ResetPassword
} from './auth-validation';

const router: Router = express.Router();

router.post(
  '/sign-up',
  uploadSingle('avatar'),
  validate(LocalSignUp.shape),
  asyncHandler(AuthController.signUp)
);

router.post(
  '/login',
  validate(LocalLogin.shape),
  asyncHandler(AuthController.login)
);

router.post(
  '/forgot-password',
  validate(ForgotPassword.shape),
  asyncHandler(AuthController.forgotPassword)
);

router.post(
  '/reset-password',
  validate(ResetPassword.shape),
  asyncHandler(AuthController.resetPassword)
);

router.post(
  '/refresh-access-token',
  asyncHandler(AuthController.refreshAccessToken)
);

router.post('/logout', asyncHandler(AuthController.logout));

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login'
  }),
  asyncHandler(AuthController.loginWithProvider)
);

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/login'
  }),
  asyncHandler(AuthController.loginWithProvider)
);

export default router;
