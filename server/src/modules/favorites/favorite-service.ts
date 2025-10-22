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

    const populatedFavorite = await FavoriteModel.findById(favorite._id)
      .populate('user')
      .populate({
        path: 'workouts',
        populate: [
          { path: 'user' },
          {
            path: 'exercises.exercise',
            populate: [{ path: 'muscles' }, { path: 'equipments' }]
          }
        ]
      });

    if (!populatedFavorite) {
      throw createHttpError(500, 'Failed to populate favorite');
    }

    return populatedFavorite;
  },

  listByUser: async (
    userId: string,
    {
      page = 1,
      limit = 10,
      filterParams = {},
      sortBy = 'createdAt',
      sortOrder = 'desc'
    }
  ) => {
    if (!userId) {
      throw createHttpError(400, 'userId is required');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const filterRecord: Record<string, any> = { user: userId };

    for (const [key, value] of Object.entries(filterParams)) {
      if (value && value !== '') {
        filterRecord[key] = { $regex: value, $options: 'i' };
      }
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as any;

    const totalFavorites = await FavoriteModel.countDocuments(filterRecord);
    const totalPages = Math.ceil(totalFavorites / limit);

    let favorites = await FavoriteModel.findOne({ user: userId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('user')
      .populate({
        path: 'workouts',
        populate: [
          { path: 'user' },
          {
            path: 'exercises.exercise',
            populate: [{ path: 'muscles' }, { path: 'equipments' }]
          }
        ]
      });

    if (!favorites) {
      favorites = await FavoriteModel.create({ user: userId, workouts: [] });
    }

    return {
      favorites,
      totalFavorites,
      totalPages
    };
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

    const favorite = await FavoriteModel.findOne({ user: userId });

    if (!favorite) {
      throw createHttpError(404, 'Favorite list not found');
    }

    for (const workoutId of favoriteData.workouts) {
      if (!Types.ObjectId.isValid(workoutId)) {
        throw createHttpError(400, `Invalid workoutId: ${workoutId}`);
      }

      const initialLength = favorite.workouts.length;
      favorite.workouts = favorite.workouts.filter(
        id => !id.equals(new Types.ObjectId(workoutId))
      );

      if (favorite.workouts.length === initialLength) {
        throw createHttpError(
          404,
          `Workout ${workoutId} not found in favorites`
        );
      }
    }

    await favorite.save();

    const populatedFavorite = await FavoriteModel.findById(favorite._id)
      .populate('user')
      .populate({
        path: 'workouts',
        populate: [
          { path: 'user' },
          {
            path: 'exercises.exercise',
            populate: [{ path: 'muscles' }, { path: 'equipments' }]
          }
        ]
      });

    if (!populatedFavorite) {
      throw createHttpError(500, 'Failed to populate favorite');
    }

    return populatedFavorite;
  }
};

export default FavoriteService;
