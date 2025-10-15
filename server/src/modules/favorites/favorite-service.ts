import createHttpsError from 'http-errors';
import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import FavoriteModel from './favorite-model';
import { IFavorite } from './favorite-type';

const FavoriteService = {
  addFavoriteItem: async (userId: string, favoriteData: IFavorite) => {
    if (!userId) {
      throw createHttpError(400, 'user is required');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    if (!favoriteData.workouts || favoriteData.workouts.length === 0) {
      throw createHttpError(400, 'workouts is required');
    }

    let favorite = await FavoriteModel.findOne({ user: userId });

    if (!favorite) {
      favorite = await FavoriteModel.create({
        user: userId,
        workouts: []
      });
    }

    for (const workoutId of favoriteData.workouts) {
      if (!Types.ObjectId.isValid(workoutId)) {
        throw createHttpError(400, `Invalid workoutId: ${workoutId}`);
      }

      const workoutObjectId = new Types.ObjectId(workoutId);

      if (!favorite.workouts.some(id => id.equals(workoutObjectId))) {
        favorite.workouts.push(workoutObjectId);
      }
    }

    await favorite.save();
    return favorite;
  },

  listByUser: async (userId: string) => {
    if (!userId) {
      throw createHttpError(400, 'userId is required');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    let favorite = await FavoriteModel.findOne({ user: userId }).populate(
      'workouts'
    );

    if (!favorite) {
      favorite = await FavoriteModel.create({ user: userId, workouts: [] });
    }

    return favorite;
  },

  removeFavoriteItem: async (userId: string, favoriteData: IFavorite) => {
    if (!userId) {
      throw createHttpError(400, 'userId is required');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    if (!favoriteData.workouts || favoriteData.workouts.length === 0) {
      throw createHttpError(400, 'workoutId is required');
    }

    const favourite = await FavoriteModel.findOne({ user: userId });

    if (!favourite) {
      throw createHttpError(404, 'Favourite list not found');
    }

    for (const workoutId of favoriteData.workouts) {
      if (!Types.ObjectId.isValid(workoutId)) {
        throw createHttpError(400, `Invalid workoutId: ${workoutId}`);
      }

      const initialLength = favourite.workouts.length;
      favourite.workouts = favourite.workouts.filter(
        id => !id.equals(new Types.ObjectId(workoutId))
      );

      if (favourite.workouts.length === initialLength) {
        throw createHttpError(
          404,
          `Workout ${workoutId} not found in favourites`
        );
      }
    }

    await favourite.save();
    return favourite;
  }
};

export default FavoriteService;
