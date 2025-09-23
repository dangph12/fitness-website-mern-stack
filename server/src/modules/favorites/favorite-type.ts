import { Types } from 'mongoose';

export interface IFavorite {
  userId: Types.ObjectId;
  workoutId: Types.ObjectId;
}
