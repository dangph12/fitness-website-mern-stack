import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { uploadImage } from '~/utils/cloudinary';

import FoodModel from '../foods/food-model';
import UserModel from '../users/user-model';
import MealModel from './meal-model';
import { IMeal, IMultipleMeals, IMultipleMealsUpdate } from './meal-type';

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
      filterRecord.scheduledAt = {};

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filterRecord.scheduledAt.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filterRecord.scheduledAt.$lte = end;
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

  findByUser: async (userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const meals = await MealModel.find({ user: userId })
      .populate('user')
      .populate('foods.food');

    return meals;
  },

  findByAdmin: async () => {
    const adminIds: Types.ObjectId[] = await UserModel.find({
      role: 'admin'
    }).distinct('_id');

    if (adminIds.length === 0) return [];

    const meals = await MealModel.find({ user: { $in: adminIds } })
      .populate('user')
      .populate('foods.food');

    return meals;
  },

  cloneAdminMealToUser: async (mealId: string, userId: string) => {
    if (!Types.ObjectId.isValid(mealId)) {
      throw createHttpError(400, 'Invalid mealId');
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const meal = await MealModel.findById(mealId).populate('user');
    if (!meal) {
      throw createHttpError(404, 'Meal not found');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    // Only users can clone meals (admin cannot clone)
    if (user.role === 'admin') {
      throw createHttpError(400, 'Admin cannot clone meals');
    }

    // Check if the meal belongs to an admin
    const mealOwner = meal.user as any;
    if (!mealOwner || mealOwner.role !== 'admin') {
      throw createHttpError(403, 'You can only clone admin meals');
    }

    const clonedMealData = {
      title: meal.title,
      image: meal.image,
      mealType: meal.mealType,
      user: userId,
      foods: meal.foods,
      scheduledAt: meal.scheduledAt
    };

    const clonedMeal = await MealModel.create(clonedMealData);
    if (!clonedMeal) {
      throw createHttpError(500, 'Failed to clone meal');
    }

    const populatedMeal = await MealModel.findById(clonedMeal._id)
      .populate('user')
      .populate('foods.food');

    if (!populatedMeal) {
      throw createHttpError(500, 'Failed to populate cloned meal');
    }

    return populatedMeal;
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

  createMultiple: async (
    mealsData: IMultipleMeals,
    files?: Express.Multer.File[]
  ) => {
    const createdMeals = [];

    for (let i = 0; i < mealsData.meals.length; i++) {
      const meal = mealsData.meals[i];
      const file = files?.[i];

      const createdMeal = await MealService.create(meal, file);
      if (!createdMeal) {
        throw createHttpError(500, `Failed to create meal at index ${i}`);
      }

      createdMeals.push(createdMeal);
    }

    return createdMeals;
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

  updateMultiple: async (
    mealsData: IMultipleMealsUpdate,
    files?: Express.Multer.File[]
  ) => {
    for (let i = 0; i < mealsData.meals.length; i++) {
      const mealData = mealsData.meals[i];
      const { _id } = mealData;

      if (!_id) {
        throw createHttpError(400, `Meal at index ${i} is missing _id`);
      }

      if (!Types.ObjectId.isValid(_id)) {
        throw createHttpError(400, `Invalid ObjectId at index ${i}: ${_id}`);
      }

      const existingMeal = await MealModel.findById(_id);
      if (!existingMeal) {
        throw createHttpError(404, `Meal not found with id: ${_id}`);
      }
    }

    const updatedMeals = [];

    for (let i = 0; i < mealsData.meals.length; i++) {
      const mealData = mealsData.meals[i];
      const file = files?.[i];

      const { _id, ...updateData } = mealData;

      const updatedMeal = await MealService.update(_id, updateData, file);
      if (!updatedMeal) {
        throw createHttpError(500, `Failed to update meal at index ${i}`);
      }

      updatedMeals.push(updatedMeal);
    }

    return updatedMeals;
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
