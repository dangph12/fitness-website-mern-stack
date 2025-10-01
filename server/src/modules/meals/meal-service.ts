import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { uploadImage } from '~/utils/cloudinary';

import MealModel from './meal-model';
import { IMeal } from './meal-type';

const MealService = {
  findAll: async () => {
    const meals = await MealModel.find();

    return meals;
  },

  findById: async (mealId: string) => {
    if (!Types.ObjectId.isValid(mealId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const meal = await MealModel.findById(mealId);

    if (!meal) {
      throw createHttpError(404, 'Meal not found');
    }

    return meal;
  },

  create: async (mealData: IMeal, file?: Express.Multer.File) => {
    if (!Types.ObjectId.isValid(mealData.userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    if (
      mealData.foods &&
      !mealData.foods.every(foodId => Types.ObjectId.isValid(foodId))
    ) {
      throw createHttpError(400, 'One or more food IDs are invalid');
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

    return newMeal;
  },

  update: async (
    mealId: string,
    updateData: Partial<IMeal>,
    file?: Express.Multer.File
  ) => {
    if (!Types.ObjectId.isValid(mealId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    if (updateData.userId && !Types.ObjectId.isValid(updateData.userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    if (
      updateData.foods &&
      !updateData.foods.every(foodId => Types.ObjectId.isValid(foodId))
    ) {
      throw createHttpError(400, 'One or more food IDs are invalid');
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

    return updatedMeal;
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
