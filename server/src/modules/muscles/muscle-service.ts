import createHttpError from 'http-errors';

import MuscleModel from './muscle-model';
import { IMuscle } from './muscle-type';
import { uploadImage } from '~/utils/cloudinary';

const MuscleService = {
  findAll: async () => {
    const muscles = await MuscleModel.find();

    return muscles;
  },

  findById: async (muscleId: string) => {
    const muscle = await MuscleModel.findById(muscleId);

    if (!muscle) {
      throw createHttpError(404, 'Muscle not found');
    }
  },

  create: async (muscleData: IMuscle, file?: Express.Multer.File) => {
    if (!file) {
      throw createHttpError(400, 'No file provided');
    }

    const existingMuscle = await MuscleModel.findOne({
      title: muscleData.title
    });
    if (existingMuscle) {
      throw createHttpError(409, 'Muscle with this title already exists');
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

    const newMuscleData = { ...muscleData, image: imageUrl };

    const newMuscle = MuscleModel.create(newMuscleData);
    if (!newMuscle) {
      throw createHttpError(500, 'Failed to create muscle');
    }

    return newMuscle;
  },

  update: async (
    muscleId: string,
    updateData: Partial<IMuscle>,
    file?: Express.Multer.File
  ) => {
    const existingMuscle = await MuscleModel.findById(muscleId);
    if (!existingMuscle) {
      throw createHttpError(404, 'Muscle not found');
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

    const updatedMuscleData = {
      ...updateData,
      image: imageUrl || existingMuscle.image
    };

    const updatedMuscle = await MuscleModel.findByIdAndUpdate(
      muscleId,
      updatedMuscleData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedMuscle) {
      throw createHttpError(500, 'Failed to update muscle');
    }

    return updatedMuscle;
  },

  remove: async (muscleId: string) => {
    const muscle = await MuscleModel.findByIdAndDelete(muscleId);

    if (!muscle) {
      throw createHttpError(404, 'Muscle not found');
    }
  }
};

export default MuscleService;
