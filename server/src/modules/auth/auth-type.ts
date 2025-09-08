import { Types } from 'mongoose';

export interface IAuth {
  user: Types.ObjectId;
  provider: string;
  providerId: string;
  localPassword?: string;
  verifyAt?: Date;
}
