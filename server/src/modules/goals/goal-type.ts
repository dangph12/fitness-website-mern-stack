import { Types } from 'mongoose';

export interface IGoal {
  targetWeight: number;
  userId: Types.ObjectId;
}
