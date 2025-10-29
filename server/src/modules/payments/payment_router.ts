import express, { Router } from 'express';

import asyncHandler from '~/utils/async-handler';

import { paymentController } from './payment_controller';

const router: Router = express.Router();

router.post(
  '/create-payment-link',
  asyncHandler(paymentController.createPayment)
);

export default router as Router;
