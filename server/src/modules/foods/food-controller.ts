import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import FoodService from './food-service';

const FoodController = {
  find: async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      ...filterParams
    } = req.query;

    const foods = await FoodService.find({
      page: Number(page),
      limit: Number(limit),
      filterParams: filterParams,
      sortBy: sortBy as string,
      sortOrder: sortOrder as string
    });
    return res
      .status(200)
      .json(ApiResponse.success('Foods retrieved successfully', foods));
  },

  findById: async (req: Request, res: Response) => {
    const foodId = req.params.id;
    const food = await FoodService.findById(foodId);
    return res
      .status(200)
      .json(ApiResponse.success('Food retrieved successfully', food));
  },

  create: async (req: Request, res: Response) => {
    const foodData = req.body;
    const newFood = await FoodService.create(foodData, req.file);
    return res
      .status(201)
      .json(ApiResponse.success('Food created successfully', newFood));
  },

  update: async (req: Request, res: Response) => {
    const foodId = req.params.id;
    const updateData = req.body;
    const updatedFood = await FoodService.update(foodId, updateData, req.file);
    return res
      .status(200)
      .json(ApiResponse.success('Food updated successfully', updatedFood));
  },

  remove: async (req: Request, res: Response) => {
    const foodId = req.params.id;
    await FoodService.remove(foodId);
    return res
      .status(200)
      .json(ApiResponse.success('Food deleted successfully'));
  }
};

export default FoodController;
