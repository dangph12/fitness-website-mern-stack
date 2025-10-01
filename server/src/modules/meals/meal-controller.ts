import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import MealService from './meal-service';

const MealController = {
  findAll: async (req: Request, res: Response) => {
    const meals = await MealService.findAll();

    return res
      .status(200)
      .json(ApiResponse.success('Meals retrieved successfully', meals));
  },

  findById: async (req: Request, res: Response) => {
    const mealId = req.params.id;
    const meal = await MealService.findById(mealId);
    return res
      .status(200)
      .json(ApiResponse.success('Meal retrieved successfully', meal));
  },

  create: async (req: Request, res: Response) => {
    const mealData = req.body;
    const newMeal = await MealService.create(mealData, req.file);
    return res
      .status(201)
      .json(ApiResponse.success('Meal created successfully', newMeal));
  },

  update: async (req: Request, res: Response) => {
    const mealId = req.params.id;
    const updateData = req.body;
    const updatedMeal = await MealService.update(mealId, updateData, req.file);
    return res
      .status(200)
      .json(ApiResponse.success('Meal updated successfully', updatedMeal));
  },

  remove: async (req: Request, res: Response) => {
    const mealId = req.params.id;
    await MealService.remove(mealId);
    return res
      .status(200)
      .json(ApiResponse.success('Meal deleted successfully'));
  }
};

export default MealController;
