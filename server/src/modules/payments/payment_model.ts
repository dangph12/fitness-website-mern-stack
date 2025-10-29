import { Document, model, Schema, Types } from 'mongoose';

import { MembershipLevel } from '../users/user-type';

export type PaymentStatus = 'pending' | 'completed' | 'cancelled';
export type MembershipUpgradeLevel = Exclude<MembershipLevel, 'normal'>;

export interface IPayment {
  user?: Types.ObjectId;
  orderCode: number;
  amount: number;
  returnUrl: string;
  cancelUrl: string;
  status: PaymentStatus;
  checkoutUrl: string;
  paymentLinkId?: string;
  targetMembership?: MembershipUpgradeLevel;
  previousMembership?: MembershipLevel;
  completedAt?: Date;
  cancellationReason?: string;
}

export interface IPaymentDocument extends IPayment, Document {}

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    orderCode: { type: Number, required: true, unique: true },
    amount: { type: Number, required: true },
    returnUrl: { type: String, required: true },
    cancelUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    },
    checkoutUrl: { type: String, required: true },
    paymentLinkId: { type: String },
    targetMembership: {
      type: String,
      enum: ['vip', 'premium']
    },
    previousMembership: {
      type: String,
      enum: ['normal', 'vip', 'premium']
    },
    completedAt: { type: Date },
    cancellationReason: { type: String }
  },
  { timestamps: true }
);

const PaymentModel = model<IPaymentDocument>('Payment', PaymentSchema);

export default PaymentModel;
