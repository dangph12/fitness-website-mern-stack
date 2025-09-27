import createHttpError from 'http-errors';

import FoodModel from './food-model';
import { IFood } from './food-type';

const FoodService = {
  find: async ({
    page = 1,
    limit = 10,
    filterParams = {},
    sortBy = 'createdAt',
    sortOrder = 'desc'
  }) => {
    const filterRecord: Record<string, any> = {};

    for (const [key, value] of Object.entries(filterParams)) {
      if (value && value !== '') {
        // options for case-insensitive
        filterRecord[key] = { $regex: value, $options: 'i' };
      }
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as any;

    const totalFoods = await FoodModel.countDocuments(filterRecord);
    const totalPages = Math.ceil(totalFoods / limit);

    const foods = await FoodModel.find(filterRecord)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return {
      foods,
      totalFoods,
      totalPages
    };
  },

  findById: async (foodId: string) => {
    const food = await FoodModel.findById(foodId);

    if (!food) {
      throw createHttpError(404, 'Food not found');
    }

    return food;
  },

  create: async (foodData: IFood) => {
    const existingFood = await FoodModel.findOne({ title: foodData.title });
    if (existingFood) {
      throw createHttpError(409, 'Food with this title already exists');
    }

    const newFood = FoodModel.create(foodData);
    if (!newFood) {
      throw createHttpError(500, 'Failed to create food');
    }

    return newFood;
  },

  update: async (foodId: string, updateData: Partial<IFood>) => {
    const updatedFood = await FoodModel.findByIdAndUpdate(foodId, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedFood) {
      throw createHttpError(404, 'Food not found');
    }

    return updatedFood;
  },

  remove: async (foodId: string) => {
    const food = await FoodModel.findByIdAndDelete(foodId);

    if (!food) {
      throw createHttpError(404, 'Food not found');
    }
  }
};

export default FoodService;
