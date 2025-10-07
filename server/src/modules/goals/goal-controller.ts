import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import GoalService from './goal-service';

const GoalController = {
  findAll: async (req: Request, res: Response) => {
    const goals = await GoalService.findAll();

    return res
      .status(200)
      .json(ApiResponse.success('Goals retrieved successfully', goals));
  },

  findById: async (req: Request, res: Response) => {
    const goalId = req.params.id;
    const goal = await GoalService.findById(goalId);

    return res
      .status(200)
      .json(ApiResponse.success('Goal retrieved successfully', goal));
  },

  findByUser: async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const goal = await GoalService.findByUser(userId);

    return res
      .status(200)
      .json(ApiResponse.success('Goal retrieved successfully', goal));
  },

  create: async (req: Request, res: Response) => {
    const goalData = req.body;
    const newGoal = await GoalService.create(goalData);

    return res
      .status(201)
      .json(ApiResponse.success('Goal created successfully', newGoal));
  },

  update: async (req: Request, res: Response) => {
    const goalId = req.params.id;
    const updateData = req.body;
    const updatedGoal = await GoalService.update(goalId, updateData);

    return res
      .status(200)
      .json(ApiResponse.success('Goal updated successfully', updatedGoal));
  },

  remove: async (req: Request, res: Response) => {
    const goalId = req.params.id;
    await GoalService.remove(goalId);
    return res
      .status(200)
      .json(ApiResponse.success('Goal deleted successfully'));
  }
};

export default GoalController;
