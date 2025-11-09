import express, { Router } from 'express';

import asyncHandler from '~/utils/async-handler';

import { paymentController } from './payment_controller';

const router: Router = express.Router();

router.post(
  '/create-payment-link',
  asyncHandler(paymentController.createPayment)
);

router.get('/user/:userId', asyncHandler(paymentController.listPaymentsByUser));

router.get(
  '/membership',
  asyncHandler(paymentController.listMembershipPayments)
);

router.get(
  '/membership/order/:orderCode',
  asyncHandler(paymentController.getMembershipPaymentByOrderCode)
);

router.patch(
  '/membership/order/:orderCode/status',
  asyncHandler(paymentController.updateMembershipPaymentStatus)
);

export default router as Router;
