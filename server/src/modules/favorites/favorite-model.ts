import { model, Schema } from 'mongoose';

import { IFavorite } from './favorite-type';

const FavoriteSchema = new Schema<IFavorite>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workout: { type: Schema.Types.ObjectId, ref: 'Workout' }
  },
  { timestamps: true }
);

const Favorite = model<IFavorite>('Favorite', FavoriteSchema);
export default Favorite;
