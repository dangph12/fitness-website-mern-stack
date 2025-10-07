import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import UserModel from '../users/user-model';
import GoalModel from './goal-model';
import { IGoal } from './goal-type';

const GoalService = {
  findAll: async () => {
    const goals = await GoalModel.find().populate('user');
    return goals;
  },

  findById: async (goalId: string) => {
    if (!Types.ObjectId.isValid(goalId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const goal = await GoalModel.findById(goalId).populate('user');

    if (!goal) {
      throw createHttpError(404, 'Goal not found');
    }

    return goal;
  },

  findByUser: async (userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const goal = await GoalModel.findOne({ user: userId }).populate('user');

    if (!goal) {
      throw createHttpError(404, 'Goal not found');
    }

    return goal;
  },

  create: async (goalData: IGoal) => {
    if (!Types.ObjectId.isValid(goalData.user)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const existingUser = await UserModel.findById(goalData.user);
    if (!existingUser) {
      throw createHttpError(404, 'User not found');
    }

    const goal = await GoalModel.create(goalData);

    if (!goal) {
      throw createHttpError(500, 'Failed to create goal');
    }

    return goal;
  },

  update: async (goalId: string, goalData: Partial<IGoal>) => {
    if (!Types.ObjectId.isValid(goalId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    if (goalData.user && !Types.ObjectId.isValid(goalData.user)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const existingGoal = await GoalModel.findById(goalId);
    if (!existingGoal) {
      throw createHttpError(404, 'Goal not found');
    }

    const updatedGoal = await GoalModel.findByIdAndUpdate(goalId, goalData, {
      new: true,
      runValidators: true
    });

    if (!updatedGoal) {
      throw createHttpError(500, 'Failed to update goal');
    }

    return updatedGoal;
  },

  remove: async (goalId: string) => {
    if (!Types.ObjectId.isValid(goalId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const goal = await GoalModel.findByIdAndDelete(goalId);

    if (!goal) {
      throw createHttpError(404, 'Goal not found');
    }
  }
};

export default GoalService;
