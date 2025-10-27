import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { uploadImage } from '~/utils/cloudinary';

import FoodModel from '../foods/food-model';
import UserModel from '../users/user-model';
import MealModel from './meal-model';
import { IMeal } from './meal-type';

const MealService = {
  find: async ({
    page = 1,
    limit = 10,
    filterParams = {},
    sortBy = 'createdAt',
    sortOrder = 'desc'
  }) => {
    const filterRecord: Record<string, any> = {};

    const { startDate, endDate, ...otherFilters } = filterParams as {
      startDate?: string;
      endDate?: string;
      [key: string]: any;
    };

    if (startDate || endDate) {
      filterRecord.scheduleAt = {};

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filterRecord.scheduleAt.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filterRecord.scheduleAt.$lte = end;
      }
    }

    for (const [key, value] of Object.entries(otherFilters)) {
      if (value && value !== '') {
        filterRecord[key] = { $regex: value, $options: 'i' };
      }
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as any;

    const totalMeals = await MealModel.countDocuments(filterRecord);
    const totalPages = Math.ceil(totalMeals / limit);

    const meals = await MealModel.find(filterRecord)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('user')
      .populate('foods.food');

    return {
      meals,
      totalMeals,
      totalPages
    };
  },

  findById: async (mealId: string) => {
    if (!Types.ObjectId.isValid(mealId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const meal = await MealModel.findById(mealId)
      .populate('user')
      .populate('foods.food');

    if (!meal) {
      throw createHttpError(404, 'Meal not found');
    }

    return meal;
  },

  create: async (mealData: IMeal, file?: Express.Multer.File) => {
    if (!Types.ObjectId.isValid(mealData.user)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const user = await UserModel.findById(mealData.user);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    for (const item of mealData.foods) {
      if (!Types.ObjectId.isValid(item.food)) {
        throw createHttpError(400, 'Invalid foodId');
      }

      const food = await FoodModel.findById(item.food);
      if (!food) {
        throw createHttpError(404, `Food not found: ${item.food}`);
      }
    }

    const existingMeal = await MealModel.findOne({
      title: mealData.title
    });
    if (existingMeal) {
      throw createHttpError(409, 'Meal with this title already exists');
    }

    let imageUrl: string | undefined;
    if (file) {
      const uploadResult = await uploadImage(file.buffer);

      if (!uploadResult.success || !uploadResult.data) {
        throw createHttpError(
          500,
          uploadResult.error || 'Failed to upload image'
        );
      }

      imageUrl = uploadResult.data.secure_url;
    }

    const newMealData = { ...mealData, image: imageUrl };

    const newMeal = await MealModel.create(newMealData);
    if (!newMeal) {
      throw createHttpError(500, 'Failed to create meal');
    }

    const populatedMeal = await MealModel.findById(newMeal._id)
      .populate('user')
      .populate('foods.food');

    if (!populatedMeal) {
      throw createHttpError(500, 'Failed to populate meal');
    }

    return populatedMeal;
  },

  update: async (
    mealId: string,
    updateData: Partial<IMeal>,
    file?: Express.Multer.File
  ) => {
    if (!Types.ObjectId.isValid(mealId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    if (updateData.user && !Types.ObjectId.isValid(updateData.user)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const user = await UserModel.findById(updateData.user);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    for (const item of updateData.foods || []) {
      if (!Types.ObjectId.isValid(item.food)) {
        throw createHttpError(400, 'Invalid foodId');
      }

      const food = await FoodModel.findById(item.food);
      if (!food) {
        throw createHttpError(404, `Food not found: ${item.food}`);
      }
    }

    const existingTitleMeal = await MealModel.findOne({
      title: updateData.title
    });
    if (existingTitleMeal && existingTitleMeal._id.toString() !== mealId) {
      throw createHttpError(409, 'Meal with this title already exists');
    }

    const existingMeal = await MealModel.findById(mealId);
    if (!existingMeal) {
      throw createHttpError(404, 'Meal not found');
    }

    let imageUrl: string | undefined;
    if (file) {
      const uploadResult = await uploadImage(file.buffer);

      if (!uploadResult.success || !uploadResult.data) {
        throw createHttpError(
          500,
          uploadResult.error || 'Failed to upload image'
        );
      }

      imageUrl = uploadResult.data.secure_url;
    }

    const updatedMealData = {
      ...updateData,
      image: imageUrl || existingMeal.image
    };

    const updatedMeal = await MealModel.findByIdAndUpdate(
      mealId,
      updatedMealData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedMeal) {
      throw createHttpError(500, 'Failed to update meal');
    }

    const populatedMeal = await MealModel.findById(mealId)
      .populate('user')
      .populate('foods.food');

    if (!populatedMeal) {
      throw createHttpError(500, 'Failed to populate meal');
    }

    return populatedMeal;
  },

  remove: async (mealId: string) => {
    if (!Types.ObjectId.isValid(mealId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const meal = await MealModel.findByIdAndDelete(mealId);

    if (!meal) {
      throw createHttpError(404, 'Meal not found');
    }
  }
};

export default MealService;
