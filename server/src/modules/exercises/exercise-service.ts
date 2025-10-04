import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { deleteExerciseImage, uploadExerciseImage } from '~/utils/cloudinary';

import ExerciseModel from './exercise-model';
import { IExercise } from './exercise-type';

const ExerciseService = {
  findAll: async () => {
    const exercises = await ExerciseModel.find();

    return exercises;
  },

  findById: async (exerciseId: string) => {
    if (!Types.ObjectId.isValid(exerciseId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const exercise = await ExerciseModel.findById(exerciseId);

    if (!exercise) {
      throw createHttpError(404, 'Exercise not found');
    }

    return exercise;
  },

  create: async (exerciseData: IExercise, file?: Express.Multer.File) => {
    if (!file) {
      throw createHttpError(400, 'No file provided');
    }

    const existingExercise = await ExerciseModel.findOne({
      title: exerciseData.title
    });
    if (existingExercise) {
      throw createHttpError(409, 'Exercise with this title already exists');
    }

    const newExercise = await ExerciseModel.create({
      exerciseData
    });

    if (!newExercise) {
      throw createHttpError(500, 'Failed to create exercise');
    }

    const uploadResult = await uploadExerciseImage(
      file.buffer,
      newExercise._id.toString()
    );

    if (!uploadResult.success || !uploadResult.data) {
      await ExerciseModel.findByIdAndDelete(newExercise._id);
      throw createHttpError(
        500,
        uploadResult.error || 'Failed to upload image'
      );
    }

    const imageUrl = uploadResult.data.secure_url;

    newExercise.tutorial = imageUrl;
    await newExercise.save();

    return newExercise;
  },

  update: async (
    exerciseId: string,
    updateData: Partial<IExercise>,
    file?: Express.Multer.File
  ) => {
    if (!Types.ObjectId.isValid(exerciseId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const existingExercise = await ExerciseModel.findById(exerciseId);
    if (!existingExercise) {
      throw createHttpError(404, 'Exercise not found');
    }

    let imageUrl = existingExercise.tutorial;

    if (file) {
      const uploadResult = await uploadExerciseImage(file.buffer, exerciseId);

      if (!uploadResult.success || !uploadResult.data) {
        throw createHttpError(
          500,
          uploadResult.error || 'Failed to upload image'
        );
      }

      imageUrl = uploadResult.data.secure_url;
    }

    const updatedExerciseData = {
      ...updateData,
      tutorial: imageUrl
    };

    const updatedExercise = await ExerciseModel.findByIdAndUpdate(
      exerciseId,
      updatedExerciseData,
      { new: true, runValidators: true }
    );

    if (!updatedExercise) {
      throw createHttpError(500, 'Failed to update exercise');
    }

    return updatedExercise;
  },

  remove: async (exerciseId: string) => {
    if (!Types.ObjectId.isValid(exerciseId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const exercise = await ExerciseModel.findByIdAndDelete(exerciseId);

    if (!exercise) {
      throw createHttpError(404, 'Exercise not found');
    }

    if (exercise.tutorial) {
      const deleteResult = await deleteExerciseImage(exerciseId);
      if (!deleteResult.success) {
        console.warn(
          `Failed to delete exercise image for ${exerciseId}: ${deleteResult.error}`
        );
      }
    }
  }
};

export default ExerciseService;
