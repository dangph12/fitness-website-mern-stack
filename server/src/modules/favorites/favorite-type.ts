import { Types } from 'mongoose';

export interface IFavorite {
  user: Types.ObjectId;
  workout: Types.ObjectId;
}

export interface IFavoriteInput {
  user: Types.ObjectId;
  workouts: string[];
}
