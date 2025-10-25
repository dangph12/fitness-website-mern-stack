import { Types } from 'mongoose';

export interface IFavorite {
  user: Types.ObjectId;
  workout: Types.ObjectId;
}
