import { NextFunction, Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import type { CreatePaymentParams, PaymentStatus } from './payment_service';
import { paymentService } from './payment_service';

const parseMembershipLevel = (
  level: unknown
): CreatePaymentParams['targetMembership'] => {
  if (typeof level !== 'string') {
    return undefined;
  }

  const normalized = level.trim().toLowerCase();
  if (normalized === '') {
    return undefined;
  }

  return normalized as CreatePaymentParams['targetMembership'];
};

const parseItems = (rawItems: unknown): CreatePaymentParams['items'] => {
  if (!Array.isArray(rawItems)) {
    return undefined;
  }

  return rawItems.map(item => {
    const entry = item as Record<string, unknown>;

    return {
      name: entry.name as string,
      price: Number(entry.price),
      quantity: Number(entry.quantity),
      unit: entry.unit as string | undefined,
      taxPercentage: entry.taxPercentage as -2 | -1 | 0 | 5 | 10 | undefined
    };
  });
};

const buildCreatePaymentParams = (req: Request): CreatePaymentParams => {
  const {
    amount,
    returnUrl,
    cancelUrl,
    userId,
    targetMembership,
    expiredAt,
    items,
    orderCode
  } = req.body;

  const normalizedUserId =
    typeof userId === 'string' && userId.trim() !== ''
      ? userId.trim()
      : undefined;

  let parsedOrderCode: number | undefined;
  if (orderCode !== undefined && orderCode !== null && orderCode !== '') {
    const numericOrderCode = Number(orderCode);
    if (Number.isFinite(numericOrderCode) && numericOrderCode > 0) {
      parsedOrderCode = Math.floor(numericOrderCode);
    }
  }

  return {
    amount: Number(amount),
    returnUrl,
    cancelUrl,
    userId: normalizedUserId,
    targetMembership: parseMembershipLevel(targetMembership),
    expiredAt: expiredAt ? Number(expiredAt) : undefined,
    items: parseItems(items),
    orderCode: parsedOrderCode
  };
};
export const paymentController = {
  /**
   * GET /orders
   * orderController.list()
   */
  createPayment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const payment = await paymentService.createPayment(
        buildCreatePaymentParams(req)
      );

      const { redirect } = req.body;
      const shouldRedirect =
        redirect === undefined ||
        redirect === null ||
        redirect === true ||
        redirect === 'true';

      if (shouldRedirect) {
        return res.redirect(payment.checkoutUrl);
      }

      return res
        .status(201)
        .json(ApiResponse.success('Payment created successfully', payment));
    } catch (error) {
      next(error);
    }
  },

  updateMembershipPaymentStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { orderCode } = req.params;
      const { status, cancellationReason } = req.body;

      const payment = await paymentService.updateMembershipPaymentStatus({
        orderCode: Number(orderCode),
        status: (typeof status === 'string'
          ? status.toLowerCase()
          : status) as PaymentStatus,
        cancellationReason
      });

      return res
        .status(200)
        .json(ApiResponse.success('Payment updated successfully', payment));
    } catch (error) {
      next(error);
    }
  },

  getMembershipPaymentByOrderCode: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { orderCode } = req.params;
      const payment = await paymentService.getMembershipPaymentByOrderCode(
        Number(orderCode)
      );

      return res
        .status(200)
        .json(ApiResponse.success('Payment retrieved successfully', payment));
    } catch (error) {
      next(error);
    }
  },

  listPaymentsByUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { userId } = req.params;
      const payments = await paymentService.listPaymentsByUser(userId);

      return res
        .status(200)
        .json(ApiResponse.success('Payment retrieved successfully', payments));
    } catch (error) {
      next(error);
    }
  },

  listMembershipPayments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { status } = req.query;
      const payments = await paymentService.listMembershipPayments(
        typeof status === 'string'
          ? (status.toLowerCase() as PaymentStatus)
          : undefined
      );

      return res
        .status(200)
        .json(ApiResponse.success('Payment retrieved successfully', payments));
    } catch (error) {
      next(error);
    }
  }
};
