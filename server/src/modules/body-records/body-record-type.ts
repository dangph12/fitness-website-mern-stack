import { Types } from 'mongoose';

export interface IBodyRecord {
  height: number;
  weight: number;
  bmi: number;
  user: Types.ObjectId;
}
