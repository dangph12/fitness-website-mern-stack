import { Types } from 'mongoose';

export interface IWeightRecord {
  weight: number;
  userId: Types.ObjectId;
}
