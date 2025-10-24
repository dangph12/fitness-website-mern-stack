import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import PlanModel from '../plans/plan-model';
import UserModel from '../users/user-model';
import WorkoutModel from '../workouts/workout-model';
import HistoryModel from './history-model';
import { IHistory } from './history-type';

const HistoryService = {
  addToHistory: async (historyData: IHistory) => {
    if (!historyData.user) {
      throw createHttpError(400, 'userId is required');
    }
    if (!Types.ObjectId.isValid(historyData.user)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const user = await UserModel.findById(historyData.user);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    if (!historyData.workout) {
      throw createHttpError(400, 'workout is required');
    }
    if (!Types.ObjectId.isValid(historyData.workout)) {
      throw createHttpError(400, 'Invalid workoutId');
    }

    const workout = await WorkoutModel.findById(historyData.workout);
    if (!workout) {
      throw createHttpError(404, 'Workout not found');
    }

    if (historyData.plan) {
      if (!Types.ObjectId.isValid(historyData.plan)) {
        throw createHttpError(400, 'Invalid planId');
      }

      const plan = await PlanModel.findById(historyData.plan);
      if (!plan) {
        throw createHttpError(404, 'Plan not found');
      }
    }

    if (!historyData.time || historyData.time <= 0) {
      throw createHttpError(400, 'Time must be greater than 0');
    }

    const history = await HistoryModel.create({
      user: historyData.user,
      workout: historyData.workout,
      plan: historyData.plan ? historyData.plan : null,
      time: historyData.time
    });

    const populatedHistory = await HistoryModel.findById(history._id)
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
      })
      .populate({
        path: 'plan',
        populate: [
          { path: 'user' },
          {
            path: 'workouts',
            populate: {
              path: 'exercises.exercise',
              populate: [{ path: 'muscles' }, { path: 'equipments' }]
            }
          }
        ]
      });

    if (!populatedHistory) {
      throw createHttpError(500, 'Failed to populate history');
    }

    return populatedHistory;
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

    let histories = await HistoryModel.find({ user: userId })
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
      })
      .populate({
        path: 'plan',
        populate: [
          { path: 'user' },
          {
            path: 'workouts',
            populate: {
              path: 'exercises.exercise',
              populate: [{ path: 'muscles' }, { path: 'equipments' }]
            }
          }
        ]
      });

    for (const [key, value] of Object.entries(filterParams)) {
      if (value && value !== '') {
        histories = histories.filter((history: any) => {
          const workoutField = history.workout?.[key];
          if (typeof workoutField === 'string') {
            return workoutField
              .toLowerCase()
              .includes((value as string).toLowerCase());
          }
          return false;
        });
      }
    }

    histories.sort((a: any, b: any) => {
      const aValue = a.workout?.[sortBy] || a[sortBy];
      const bValue = b.workout?.[sortBy] || b[sortBy];

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    const totalHistories = histories.length;
    const totalPages = Math.ceil(totalHistories / limit);
    const skip = (page - 1) * limit;
    const paginatedHistories = histories.slice(skip, skip + limit);

    return {
      histories: paginatedHistories,
      totalHistories,
      totalPages
    };
  },

  removeFromHistory: async (historyId: string) => {
    if (!historyId) {
      throw createHttpError(400, 'historyId is required');
    }
    if (!Types.ObjectId.isValid(historyId)) {
      throw createHttpError(400, 'Invalid historyId');
    }

    const history = await HistoryModel.findByIdAndDelete(historyId);

    if (!history) {
      throw createHttpError(404, 'History not found');
    }
  }
};

export default HistoryService;
