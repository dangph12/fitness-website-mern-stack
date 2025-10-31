import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import MealService from './meal-service';

const MealController = {
  find: async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ...filterParams
    } = req.query;

    const meals = await MealService.find({
      page: Number(page),
      limit: Number(limit),
      filterParams: filterParams,
      sortBy: sortBy as string,
      sortOrder: sortOrder as string
    });

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

  findByAdmin: async (req: Request, res: Response) => {
    const meals = await MealService.findByAdmin();
    return res
      .status(200)
      .json(ApiResponse.success('Meals retrieved successfully', meals));
  },

  create: async (req: Request, res: Response) => {
    const mealData = req.body;
    const newMeal = await MealService.create(mealData, req.file);
    return res
      .status(201)
      .json(ApiResponse.success('Meal created successfully', newMeal));
  },

  createMultiple: async (req: Request, res: Response) => {
    const mealsData = req.body;
    const files = req.files as Express.Multer.File[];
    const newMeals = await MealService.createMultiple(mealsData, files);
    return res
      .status(201)
      .json(ApiResponse.success('Meals created successfully', newMeals));
  },

  update: async (req: Request, res: Response) => {
    const mealId = req.params.id;
    const updateData = req.body;
    const updatedMeal = await MealService.update(mealId, updateData, req.file);
    return res
      .status(200)
      .json(ApiResponse.success('Meal updated successfully', updatedMeal));
  },

  updateMultiple: async (req: Request, res: Response) => {
    const mealsData = req.body;
    const files = req.files as Express.Multer.File[];
    const updatedMeals = await MealService.updateMultiple(mealsData, files);
    return res
      .status(200)
      .json(ApiResponse.success('Meals updated successfully', updatedMeals));
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
