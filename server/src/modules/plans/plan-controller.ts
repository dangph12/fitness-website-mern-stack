import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import PlanService from './plan-service';

const PlanController = {
  find: async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder, ...filterParams } = req.query;

    const plans = await PlanService.find({
      page: Number(page),
      limit: Number(limit),
      filterParams: filterParams,
      sortBy: sortBy as string,
      sortOrder: sortOrder as string
    });
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

    const { page, limit, sortBy, sortOrder, ...filterParams } = req.query;

    const plans = await PlanService.findByUser(userId, {
      page: Number(page),
      limit: Number(limit),
      filterParams: filterParams,
      sortBy: sortBy as string,
      sortOrder: sortOrder as string
    });

    return res
      .status(200)
      .json(ApiResponse.success('Plan retrieved successfully', plans));
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
