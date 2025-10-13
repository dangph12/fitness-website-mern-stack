import { Types } from 'mongoose';

export interface IGoal {
  targetWeight: number;
  user: Types.ObjectId;
}
