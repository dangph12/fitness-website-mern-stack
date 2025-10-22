import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import HistoryService from './history-service';

const HistoryController = {
  addToHistory: async (req: Request, res: Response) => {
    const historyData = req.body;
    const history = await HistoryService.addToHistory(historyData);
    return res
      .status(201)
      .json(ApiResponse.success('History added successfully', history));
  },

  listByUser: async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder, ...filterParams } = req.query;
    const userId = req.params.userId;
    const history = await HistoryService.listByUser(userId, {
      page: Number(page),
      limit: Number(limit),
      filterParams: filterParams,
      sortBy: sortBy as string,
      sortOrder: sortOrder as string
    });
    return res
      .status(200)
      .json(ApiResponse.success('History retrieved successfully', history));
  },

  removeFromHistory: async (req: Request, res: Response) => {
    const historyId = req.params.id;
    await HistoryService.removeFromHistory(historyId);
    return res
      .status(200)
      .json(ApiResponse.success('History removed successfully'));
  }
};

export default HistoryController;
