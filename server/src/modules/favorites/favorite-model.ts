import { model, Schema } from 'mongoose';

import { IFavorite } from './favorite-type';

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Ref to the favorited item (could be Exercise, Meal, Plan, etc.)
    itemId: { type: Schema.Types.ObjectId, required: true }
  },
  { timestamps: true }
);

const Favorite = model<IFavorite>('Favorite', FavoriteSchema);
export default Favorite;
