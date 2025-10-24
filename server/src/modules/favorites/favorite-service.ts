import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import UserModel from '../users/user-model';
import WorkoutModel from '../workouts/workout-model';
import FavoriteModel from './favorite-model';
import { IFavorite } from './favorite-type';

const FavoriteService = {
  addFavoriteItem: async (favoriteData: IFavorite) => {
    if (!favoriteData.user) {
      throw createHttpError(400, 'user is required');
    }
    if (!Types.ObjectId.isValid(favoriteData.user)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const user = await UserModel.findById(favoriteData.user);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    if (!favoriteData.workout) {
      throw createHttpError(400, 'workout is required');
    }

    if (!Types.ObjectId.isValid(favoriteData.workout)) {
      throw createHttpError(400, `Invalid workoutId: ${favoriteData.workout}`);
    }

    const workout = await WorkoutModel.findById(favoriteData.workout);
    if (!workout) {
      throw createHttpError(404, `Workout not found: ${favoriteData.workout}`);
    }

    const existingFavorite = await FavoriteModel.findOne({
      user: favoriteData.user,
      workout: favoriteData.workout
    });

    if (existingFavorite) {
      throw createHttpError(409, 'Favorite already exists');
    }

    const newFavorite = await FavoriteModel.create({
      user: favoriteData.user,
      workout: favoriteData.workout
    });

    const populatedFavorite = await FavoriteModel.findById(newFavorite._id)
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

  remove: async (favoriteId: string) => {
    if (!favoriteId) {
      throw createHttpError(400, 'favoriteId is required');
    }
    if (!Types.ObjectId.isValid(favoriteId)) {
      throw createHttpError(400, 'Invalid favoriteId');
    }

    const favorite = await FavoriteModel.findByIdAndDelete(favoriteId);
    if (!favorite) {
      throw createHttpError(404, 'Favorite not found');
    }
  }
};

export default FavoriteService;
