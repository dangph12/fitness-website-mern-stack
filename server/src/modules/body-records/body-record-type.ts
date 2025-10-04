import { Types } from 'mongoose';

export interface IBodyRecord {
  height: number;
  weight: number;
  userId: Types.ObjectId;
  bodyClassificationId: Types.ObjectId;
}
