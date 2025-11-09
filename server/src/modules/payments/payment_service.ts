import {
  type CreatePaymentLinkRequest,
  type CreatePaymentLinkResponse
} from '@payos/node';
import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { sendMail } from '~/utils/email/mailer';
import { payOS } from '~/utils/payos';

import { userMembershipService } from '../users/user-membership-service';
import type { MembershipLevel } from '../users/user-type';
import PaymentModel, {
  type MembershipUpgradeLevel,
  type PaymentStatus
} from './payment_model';

type CreatePaymentParams = {
  amount: number;
  returnUrl: string;
  cancelUrl: string;
  userId?: string;
  targetMembership?: MembershipUpgradeLevel;
  expiredAt?: number;
  items?: CreatePaymentLinkRequest['items'];
  orderCode?: number;
};

type CreatePaymentResult = {
  checkoutUrl: string;
  orderCode: number;
  paymentLinkId?: string;
  paymentId?: string;
  status: PaymentStatus | 'external';
  targetMembership?: MembershipUpgradeLevel;
};

type UpdateMembershipPaymentStatusParams = {
  orderCode: number;
  status: PaymentStatus;
  cancellationReason?: string;
};

const MEMBERSHIP_UPGRADES: MembershipUpgradeLevel[] = ['vip', 'premium'];
const VALID_STATUSES: PaymentStatus[] = ['pending', 'completed', 'cancelled'];

const generateOrderCode = (): number => {
  const millis = Date.now().toString();
  const suffix = millis.slice(-9);
  return Number(`9${suffix}`);
};

const normalizeMembership = (level?: MembershipLevel): MembershipLevel =>
  level ?? 'normal';

const sanitizeString = (value: unknown, fieldName: string): string => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw createHttpError(400, `${fieldName} is required`);
  }
  return value.trim();
};

const sanitizeAmount = (amount: unknown): number => {
  const parsed = Number(amount);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw createHttpError(400, 'Amount must be a number greater than 0');
  }
  return Math.round(parsed);
};

const extractUserId = (user: unknown): Types.ObjectId | undefined => {
  if (!user) {
    return undefined;
  }

  if (user instanceof Types.ObjectId) {
    return user;
  }

  if (typeof user === 'object' && user !== null && '_id' in user) {
    return (user as { _id: Types.ObjectId })._id;
  }

  return undefined;
};
export const paymentService = {
  createPayment: async (
    params: CreatePaymentParams
  ): Promise<CreatePaymentResult> => {
    const amount = sanitizeAmount(params.amount);
    const returnUrl = sanitizeString(params.returnUrl, 'returnUrl');
    const cancelUrl = sanitizeString(params.cancelUrl, 'cancelUrl');

    let targetMembership: MembershipUpgradeLevel | undefined =
      params.targetMembership;
    if (typeof targetMembership === 'string') {
      targetMembership =
        targetMembership.toLowerCase() as MembershipUpgradeLevel;
    }

    if (targetMembership && !MEMBERSHIP_UPGRADES.includes(targetMembership)) {
      throw createHttpError(
        400,
        'targetMembership must be either vip or premium'
      );
    }

    let userId: Types.ObjectId | undefined;
    let previousMembership: MembershipLevel | undefined;

    if (params.userId) {
      if (!Types.ObjectId.isValid(params.userId)) {
        throw createHttpError(400, 'Invalid userId');
      }

      const user = await userMembershipService.refreshMembership(params.userId);

      userId = user._id as Types.ObjectId;
      previousMembership = normalizeMembership(
        user.membershipLevel as MembershipLevel | undefined
      );

      if (targetMembership) {
        if (targetMembership === previousMembership) {
          throw createHttpError(
            400,
            `User already has ${targetMembership.toUpperCase()} membership`
          );
        }

        if (previousMembership === 'premium' && targetMembership === 'vip') {
          throw createHttpError(
            400,
            'Cannot downgrade membership through upgrade payment'
          );
        }
      }
    } else if (targetMembership) {
      throw createHttpError(
        400,
        'userId is required when targetMembership is provided'
      );
    }

    let orderCode: number;
    if (typeof params.orderCode === 'number' && params.orderCode > 0) {
      orderCode = Math.floor(params.orderCode);
    } else {
      orderCode = generateOrderCode();
    }

    if (userId && targetMembership) {
      const existingPayment = await PaymentModel.findOne({ orderCode });
      if (existingPayment) {
        throw createHttpError(409, 'Order code already exists');
      }
    }

    const requestBody: CreatePaymentLinkRequest = {
      orderCode,
      amount,
      description: String(orderCode),
      returnUrl,
      cancelUrl,
      expiredAt: params.expiredAt,
      items: params.items
    };

    const paymentLinkResponse: CreatePaymentLinkResponse =
      await payOS.paymentRequests.create(requestBody);

    let paymentId: string | undefined;
    if (userId && targetMembership) {
      const payment = await PaymentModel.create({
        user: userId,
        orderCode,
        amount,
        returnUrl,
        cancelUrl,
        status: 'pending',
        checkoutUrl: paymentLinkResponse.checkoutUrl,
        paymentLinkId: paymentLinkResponse.paymentLinkId,
        targetMembership,
        previousMembership
      });

      paymentId = payment.id;
    }

    console.log(paymentLinkResponse.checkoutUrl);

    return {
      checkoutUrl: paymentLinkResponse.checkoutUrl,
      orderCode,
      paymentLinkId: paymentLinkResponse.paymentLinkId,
      paymentId,
      status: paymentId ? 'pending' : 'external',
      targetMembership
    };
  },

  updateMembershipPaymentStatus: async ({
    orderCode,
    status,
    cancellationReason
  }: UpdateMembershipPaymentStatusParams) => {
    if (!Number.isFinite(orderCode) || orderCode <= 0) {
      throw createHttpError(400, 'orderCode must be a positive number');
    }

    if (!VALID_STATUSES.includes(status)) {
      throw createHttpError(400, 'Invalid payment status');
    }

    const payment = await PaymentModel.findOne({ orderCode }).populate({
      path: 'user',
      select: 'membershipLevel name email'
    });

    if (!payment || !payment.targetMembership) {
      throw createHttpError(404, 'Membership payment not found');
    }

    payment.status = status;

    if (status === 'completed') {
      payment.completedAt = new Date();
      payment.cancellationReason = undefined;

      const userId = extractUserId(payment.user);
      const targetMembershipLevel = payment.targetMembership;
      if (userId && targetMembershipLevel) {
        await userMembershipService.applyMembershipLevel(
          userId,
          targetMembershipLevel
        );

        const user = payment.user as any;
        await sendMail({
          to: user.email,
          subject: `🎉 Chúc mừng! Bạn đã nâng cấp lên ${targetMembershipLevel.toUpperCase()}`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 0; margin: 0; background-color: #f4f4f4;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 35px 20px; text-align: center;">
                  <div style="font-size: 50px; margin-bottom: 10px;">🎊</div>
                  <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: bold;">
                    Chúc Mừng Nâng Cấp!
                  </h1>
                </div>
                
                <div style="padding: 35px 30px;">
                  <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">
                    Xin chào ${user.name}! 👋
                  </h2>
                  
                  <p style="font-size: 16px; line-height: 1.7; color: #555; margin-bottom: 25px;">
                    Chúc mừng bạn đã <strong>nâng cấp thành công</strong> lên hạng thành viên 
                    <strong style="color: #667eea;">${targetMembershipLevel.toUpperCase()}</strong>! 
                    Bạn sẽ được tận hưởng nhiều quyền lợi đặc biệt dành riêng cho hạng này.
                  </p>
                  
                  <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); 
                              border-left: 4px solid #667eea; 
                              padding: 20px; 
                              border-radius: 8px; 
                              margin: 25px 0;">
                    <p style="margin: 8px 0; font-size: 15px; color: #333;">
                      <span style="display: inline-block; width: 130px; font-weight: bold;">🏆 Hạng thành viên:</span>
                      <span style="color: #667eea; font-weight: bold;">${targetMembershipLevel.toUpperCase()}</span>
                    </p>
                    <p style="margin: 8px 0; font-size: 15px; color: #333;">
                      <span style="display: inline-block; width: 130px; font-weight: bold;">📅 Ngày kích hoạt:</span>
                      <span>${new Date().toLocaleDateString('vi-VN')}</span>
                    </p>
                    <p style="margin: 8px 0; font-size: 15px; color: #333;">
                      <span style="display: inline-block; width: 130px; font-weight: bold;">✨ Quyền lợi:</span>
                      <span>Ưu đãi độc quyền, Hỗ trợ ưu tiên</span>
                    </p>
                  </div>
                  
                  <div style="background-color: #f9f9f9; 
                              padding: 18px; 
                              border-radius: 8px; 
                              margin: 25px 0;
                              text-align: center;">
                    <p style="font-size: 15px; color: #666; margin: 0; line-height: 1.6;">
                      💜 <strong>Cảm ơn bạn</strong> đã tin tưởng và đồng hành cùng chúng tôi!
                    </p>
                  </div>
                  
                  <p style="font-size: 14px; color: #888; margin-top: 20px;">
                    Nếu có câu hỏi, vui lòng liên hệ với chúng tôi. Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ!
                  </p>
                </div>
                
                <div style="background-color: #f8f8f8; padding: 25px; text-align: center; border-top: 1px solid #eee;">
                  <p style="font-size: 12px; color: #999; margin: 8px 0;">
                    📧 Email này được gửi tự động, vui lòng không trả lời trực tiếp.
                  </p>
                  <p style="font-size: 11px; color: #aaa; margin: 5px 0;">
                    © 2025 F-Fitness. All rights reserved.
                  </p>
                </div>
                
              </div>
            </div>
          `
        });
      }
    } else if (status === 'cancelled') {
      payment.cancellationReason = cancellationReason?.trim();
      payment.completedAt = undefined;

      const userId = extractUserId(payment.user);
      if (userId && payment.previousMembership) {
        const user = await userMembershipService.refreshMembership(userId);
        if (user.membershipLevel === payment.targetMembership) {
          await userMembershipService.applyMembershipLevel(
            userId,
            normalizeMembership(payment.previousMembership)
          );
        }
      }
    }

    await payment.save();
    await payment.populate({
      path: 'user',
      select: 'name email membershipLevel'
    });
    return payment;
  },

  getMembershipPaymentByOrderCode: async (orderCode: number) => {
    if (!Number.isFinite(orderCode) || orderCode <= 0) {
      throw createHttpError(400, 'orderCode must be a positive number');
    }

    const payment = await PaymentModel.findOne({
      orderCode,
      targetMembership: { $exists: true }
    }).populate({
      path: 'user',
      select: 'name email membershipLevel'
    });

    if (!payment) {
      throw createHttpError(404, 'Membership payment not found');
    }

    return payment;
  },

  listPaymentsByUser: async (userId: string) => {
    const trimmedUserId = typeof userId === 'string' ? userId.trim() : '';
    if (!trimmedUserId || !Types.ObjectId.isValid(trimmedUserId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    return PaymentModel.find({
      user: new Types.ObjectId(trimmedUserId)
    })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: 'name email membershipLevel'
      });
  },

  listMembershipPayments: async (status?: PaymentStatus) => {
    const filter: Record<string, unknown> = {
      targetMembership: { $exists: true }
    };

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        throw createHttpError(400, 'Invalid payment status filter');
      }

      filter.status = status;
    }

    return PaymentModel.find(filter).sort({ createdAt: -1 }).populate({
      path: 'user',
      select: 'name email membershipLevel'
    });
  }
};

export type { CreatePaymentParams, CreatePaymentResult, PaymentStatus };
