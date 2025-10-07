import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import PlanService from './plan-service';

const PlanController = {
  findAll: async (req: Request, res: Response) => {
    const plans = await PlanService.findAll();

    return res
      .status(200)
      .json(ApiResponse.success('Plans retrieved successfully', plans));
  },

  findById: async (req: Request, res: Response) => {
    const planId = req.params.id;
    const plan = await PlanService.findById(planId);

    return res
      .status(200)
      .json(ApiResponse.success('Plan retrieved successfully', plan));
  },

  findByUser: async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const plan = await PlanService.findByUser(userId);

    return res
      .status(200)
      .json(ApiResponse.success('Plan retrieved successfully', plan));
  },

  create: async (req: Request, res: Response) => {
    const planData = req.body;
    const newPlan = await PlanService.create(planData, req.file);

    return res
      .status(201)
      .json(ApiResponse.success('Plan created successfully', newPlan));
  },

  update: async (req: Request, res: Response) => {
    const planId = req.params.id;
    const planData = req.body;
    const updatedPlan = await PlanService.update(planId, planData, req.file);

    return res
      .status(200)
      .json(ApiResponse.success('Plan updated successfully', updatedPlan));
  },

  remove: async (req: Request, res: Response) => {
    const planId = req.params.id;
    await PlanService.remove(planId);

    return res
      .status(200)
      .json(ApiResponse.success('Plan deleted successfully'));
  }
};

export default PlanController;
