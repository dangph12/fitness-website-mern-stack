import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { uploadImage } from '~/utils/cloudinary';

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

  findAll: async () => {
    return FoodModel.find().sort({ title: 1 }).limit(20).lean();
  },

  findById: async (foodId: string) => {
    if (!Types.ObjectId.isValid(foodId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const food = await FoodModel.findById(foodId);

    if (!food) {
      throw createHttpError(404, 'Food not found');
    }

    return food;
  },

  create: async (foodData: IFood, file?: Express.Multer.File) => {
    if (!file) {
      throw createHttpError(400, 'No file provided');
    }

    const existingFood = await FoodModel.findOne({ title: foodData.title });
    if (existingFood) {
      throw createHttpError(409, 'Food with this title already exists');
    }

    const uploadResult = await uploadImage(file.buffer);

    if (!uploadResult.success || !uploadResult.data) {
      throw createHttpError(
        500,
        uploadResult.error || 'Failed to upload image'
      );
    }

    const imageUrl = uploadResult.data.secure_url;

    const newFoodData = { ...foodData, image: imageUrl };

    const newFood = await FoodModel.create(newFoodData);
    if (!newFood) {
      throw createHttpError(500, 'Failed to create food');
    }

    return newFood;
  },

  update: async (
    foodId: string,
    updateData: Partial<IFood>,
    file?: Express.Multer.File
  ) => {
    if (!Types.ObjectId.isValid(foodId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const existingFood = await FoodModel.findById(foodId);
    if (!existingFood) {
      throw createHttpError(404, 'Food not found');
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

    const updatedFoodData = {
      ...updateData,
      image: imageUrl || existingFood.image
    };
    const updatedFood = await FoodModel.findByIdAndUpdate(
      foodId,
      updatedFoodData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedFood) {
      throw createHttpError(404, 'Food not found');
    }

    return updatedFood;
  },

  remove: async (foodId: string) => {
    if (!Types.ObjectId.isValid(foodId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const food = await FoodModel.findByIdAndDelete(foodId);

    if (!food) {
      throw createHttpError(404, 'Food not found');
    }
  }
};

export default FoodService;
