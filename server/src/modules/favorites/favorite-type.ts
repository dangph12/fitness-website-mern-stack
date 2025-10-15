import { Types } from 'mongoose';

export interface IFavorite {
  user: Types.ObjectId;
  workouts: Types.ObjectId[];
}
