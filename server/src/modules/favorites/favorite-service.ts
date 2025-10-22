import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import FavoriteModel from './favorite-model';
import { IFavoriteInput } from './favorite-type';

const FavoriteService = {
  addFavoriteItem: async (userId: string, favoriteData: IFavoriteInput) => {
    if (!userId) {
      throw createHttpError(400, 'user is required');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    if (!favoriteData.workouts || favoriteData.workouts.length === 0) {
      throw createHttpError(400, 'workouts is required');
    }

    const createdFavorites = [];

    for (const workoutId of favoriteData.workouts) {
      if (!Types.ObjectId.isValid(workoutId)) {
        throw createHttpError(400, `Invalid workoutId: ${workoutId}`);
      }

      const existingFavorite = await FavoriteModel.findOne({
        user: userId,
        workout: workoutId
      });

      if (!existingFavorite) {
        const newFavorite = await FavoriteModel.create({
          user: userId,
          workout: workoutId
        });
        createdFavorites.push(newFavorite._id);
      }
    }

    const favorites = await FavoriteModel.find({ user: userId })
      .populate('user')
      .populate({
        path: 'workout',
        populate: [
          { path: 'user' },
          {
            path: 'exercises.exercise',
            populate: [{ path: 'muscles' }, { path: 'equipments' }]
          }
        ]
      });

    return favorites;
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

    let favorites = await FavoriteModel.find({ user: userId })
      .populate('user')
      .populate({
        path: 'workout',
        populate: [
          { path: 'user' },
          {
            path: 'exercises.exercise',
            populate: [{ path: 'muscles' }, { path: 'equipments' }]
          }
        ]
      });

    for (const [key, value] of Object.entries(filterParams)) {
      if (value && value !== '') {
        favorites = favorites.filter((favorite: any) => {
          const workoutField = favorite.workout?.[key];
          if (typeof workoutField === 'string') {
            return workoutField
              .toLowerCase()
              .includes((value as string).toLowerCase());
          }
          return false;
        });
      }
    }

    favorites.sort((a: any, b: any) => {
      const aValue = a.workout?.[sortBy] || a[sortBy];
      const bValue = b.workout?.[sortBy] || b[sortBy];

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    const totalFavorites = favorites.length;
    const totalPages = Math.ceil(totalFavorites / limit);
    const skip = (page - 1) * limit;
    const paginatedFavorites = favorites.slice(skip, skip + limit);

    return {
      favorites: paginatedFavorites,
      totalFavorites,
      totalPages
    };
  },

  removeFavoriteItem: async (userId: string, favoriteData: IFavoriteInput) => {
    if (!userId) {
      throw createHttpError(400, 'userId is required');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    if (!favoriteData.workouts || favoriteData.workouts.length === 0) {
      throw createHttpError(400, 'workoutId is required');
    }

    for (const workoutId of favoriteData.workouts) {
      if (!Types.ObjectId.isValid(workoutId)) {
        throw createHttpError(400, `Invalid workoutId: ${workoutId}`);
      }

      const deletedFavorite = await FavoriteModel.findOneAndDelete({
        user: userId,
        workout: workoutId
      });

      if (!deletedFavorite) {
        throw createHttpError(
          404,
          `Workout ${workoutId} not found in favorites`
        );
      }
    }

    const favorites = await FavoriteModel.find({ user: userId })
      .populate('user')
      .populate({
        path: 'workout',
        populate: [
          { path: 'user' },
          {
            path: 'exercises.exercise',
            populate: [{ path: 'muscles' }, { path: 'equipments' }]
          }
        ]
      });

    return favorites;
  }
};

export default FavoriteService;
