import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { uploadImage } from '~/utils/cloudinary';

import ExerciseModel from '../exercises/exercise-model';
import UserModel from '../users/user-model';
import WorkoutModel from './workout-model';
import { IWorkout } from './workout-type';

const WorkoutService = {
  find: async ({
    page = 1,
    limit = 10,
    filterParams = {},
    sortBy = 'createdAt',
    sortOrder = 'desc'
  }) => {
    const filterRecord: Record<string, any> = {};

    for (const [key, value] of Object.entries(filterParams)) {
      if (value !== undefined && value !== '') {
        // handling for boolean field
        if (
          typeof value === 'boolean' ||
          value === 'true' ||
          value === 'false'
        ) {
          filterRecord[key] = value === true || value === 'true';
        } else {
          // options for case-insensitive search cho string
          filterRecord[key] = { $regex: value, $options: 'i' };
        }
      }
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as any;

    const totalWorkouts = await WorkoutModel.countDocuments(filterRecord);
    const totalPages = Math.ceil(totalWorkouts / limit);

    const workouts = await WorkoutModel.find(filterRecord)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('user')
      .populate({
        path: 'exercises.exercise',
        populate: [{ path: 'muscles' }, { path: 'equipments' }]
      });

    return {
      workouts,
      totalWorkouts,
      totalPages
    };
  },

  findById: async (workoutId: string) => {
    if (!Types.ObjectId.isValid(workoutId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const workout = await WorkoutModel.findById(workoutId)
      .populate('user')
      .populate({
        path: 'exercises.exercise',
        populate: [{ path: 'muscles' }, { path: 'equipments' }]
      });

    if (!workout) {
      throw createHttpError(404, 'Workout not found');
    }

    return workout;
  },

  findByUser: async (
    userId: string,
    {
      page = 1,
      limit = 10,
      filterParams = {},
      sortBy = 'createdAt',
      sortOrder = 'desc'
    }
  ) => {
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const filterRecord: Record<string, any> = { user: userId };

    for (const [key, value] of Object.entries(filterParams)) {
      if (value !== undefined && value !== '') {
        // handling for boolean field
        if (
          typeof value === 'boolean' ||
          value === 'true' ||
          value === 'false'
        ) {
          filterRecord[key] = value === true || value === 'true';
        } else {
          // options for case-insensitive search cho string
          filterRecord[key] = { $regex: value, $options: 'i' };
        }
      }
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as any;

    const totalWorkouts = await WorkoutModel.countDocuments(filterRecord);
    const totalPages = Math.ceil(totalWorkouts / limit);

    const workouts = await WorkoutModel.find(filterRecord)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('user')
      .populate({
        path: 'exercises.exercise',
        populate: [{ path: 'muscles' }, { path: 'equipments' }]
      });

    return {
      workouts,
      totalWorkouts,
      totalPages
    };
  },

  create: async (workoutData: IWorkout, file?: Express.Multer.File) => {
    if (!Types.ObjectId.isValid(workoutData.user)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const existingUser = await UserModel.findById(workoutData.user);
    if (!existingUser) {
      throw createHttpError(404, 'User not found');
    }

    for (const exercise of workoutData.exercises) {
      if (!Types.ObjectId.isValid(exercise.exercise)) {
        throw createHttpError(400, 'Invalid exerciseId');
      }

      const existingExercise = await ExerciseModel.findById(exercise.exercise);
      if (!existingExercise) {
        throw createHttpError(404, `Exercise not found: ${exercise.exercise}`);
      }
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

    const newWorkoutData = { ...workoutData, image: imageUrl };

    const workout = await WorkoutModel.create(newWorkoutData);

    const populatedWorkout = await WorkoutModel.findById(workout._id)
      .populate('user')
      .populate({
        path: 'exercises.exercise',
        populate: [{ path: 'muscles' }, { path: 'equipments' }]
      });

    if (!populatedWorkout) {
      throw createHttpError(500, 'Failed to create workout');
    }

    return populatedWorkout;
  },

  update: async (
    workoutId: string,
    workoutData: Partial<IWorkout>,
    file?: Express.Multer.File
  ) => {
    if (!Types.ObjectId.isValid(workoutId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    if (workoutData.user && !Types.ObjectId.isValid(workoutData.user)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const existingUser = await UserModel.findById(workoutData.user);
    if (workoutData.user && !existingUser) {
      throw createHttpError(404, 'User not found');
    }

    if (workoutData.exercises) {
      for (const exercise of workoutData.exercises) {
        if (!Types.ObjectId.isValid(exercise.exercise)) {
          throw createHttpError(400, 'Invalid exerciseId');
        }

        const existingExercise = await ExerciseModel.findById(
          exercise.exercise
        );
        if (!existingExercise) {
          throw createHttpError(
            404,
            `Exercise not found: ${exercise.exercise}`
          );
        }
      }
    }

    const existingWorkout = await WorkoutModel.findById(workoutId);
    if (!existingWorkout) {
      throw createHttpError(404, 'Workout not found');
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

    const updatedWorkoutData = {
      ...workoutData,
      image: imageUrl || existingWorkout.image
    };

    const updatedWorkout = await WorkoutModel.findByIdAndUpdate(
      workoutId,
      updatedWorkoutData,
      {
        new: true,
        runValidators: true
      }
    );

    const populatedWorkout = await WorkoutModel.findById(workoutId)
      .populate('user')
      .populate({
        path: 'exercises.exercise',
        populate: [{ path: 'muscles' }, { path: 'equipments' }]
      });

    if (!populatedWorkout) {
      throw createHttpError(500, 'Failed to update workout');
    }

    return populatedWorkout;
  },

  remove: async (workoutId: string) => {
    if (!Types.ObjectId.isValid(workoutId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const workout = await WorkoutModel.findByIdAndDelete(workoutId);

    if (!workout) {
      throw createHttpError(404, 'Workout not found');
    }
  }
};

export default WorkoutService;
