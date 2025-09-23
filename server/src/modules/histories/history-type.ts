import { Types } from 'mongoose';

export interface IHistory {
  userId: Types.ObjectId;
  workoutId: Types.ObjectId;
}
