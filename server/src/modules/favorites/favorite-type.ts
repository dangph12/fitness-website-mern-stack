import { Types } from 'mongoose';

export interface IFavorite {
  userId: Types.ObjectId;
  itemId: Types.ObjectId;
}
