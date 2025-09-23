import { model, Schema } from 'mongoose';

import { IFavorite } from './favorite-type';

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workoutId: { type: Schema.Types.ObjectId, ref: 'Workout', required: true }
  },
  { timestamps: true }
);

const Favorite = model<IFavorite>('Favorite', FavoriteSchema);
export default Favorite;
