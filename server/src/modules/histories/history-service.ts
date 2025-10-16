import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import HistoryModel from './history-model';
import { IHistory } from './history-type';

const HistoryService = {
  addToHistory: async (userId: string, historyData: Partial<IHistory>) => {
    if (!userId) {
      throw createHttpError(400, 'userId is required');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    if (!historyData.workout) {
      throw createHttpError(400, 'workout is required');
    }
    if (!Types.ObjectId.isValid(historyData.workout)) {
      throw createHttpError(400, 'Invalid workoutId');
    }

    if (historyData.plan && !Types.ObjectId.isValid(historyData.plan)) {
      throw createHttpError(400, 'Invalid planId');
    }

    if (!historyData.time || historyData.time <= 0) {
      throw createHttpError(400, 'Time must be greater than 0');
    }

    const history = await HistoryModel.create({
      user: new Types.ObjectId(userId),
      workout: historyData.workout,
      plan: historyData.plan ? historyData.plan : null,
      time: historyData.time
    });

    return history;
  },

  listByUser: async (userId: string) => {
    if (!userId) {
      throw createHttpError(400, 'userId is required');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const history = await HistoryModel.find({ user: userId });

    if (!history) {
      throw createHttpError(404, 'History not found');
    }

    return history;
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
