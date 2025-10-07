import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { uploadImage } from '~/utils/cloudinary';

import ExerciseModel from '../exercises/exercise-model';
import PlanModel from '../plans/plan-model';
import UserModel from '../users/user-model';
import WorkoutModel from './workout-model';
import { IWorkout } from './workout-type';

const WorkoutService = {
  findAll: async () => {
    const workouts = await WorkoutModel.find()
      .populate('user')
      .populate('plan')
      .populate('exercises.exerciseId');
    return workouts;
  },

  findById: async (workoutId: string) => {
    if (!Types.ObjectId.isValid(workoutId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const workout = await WorkoutModel.findById(workoutId)
      .populate('user')
      .populate('plan')
      .populate('exercises.exerciseId');

    if (!workout) {
      throw createHttpError(404, 'Workout not found');
    }

    return workout;
  },

  findByUser: async (userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const workouts = await WorkoutModel.find({ user: userId })
      .populate('user')
      .populate('plan')
      .populate('exercises.exerciseId');

    return workouts;
  },

  create: async (workoutData: IWorkout, file?: Express.Multer.File) => {
    if (!Types.ObjectId.isValid(workoutData.user)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const existingUser = await UserModel.findById(workoutData.user);
    if (!existingUser) {
      throw createHttpError(404, 'User not found');
    }

    if (workoutData.plan) {
      if (!Types.ObjectId.isValid(workoutData.plan)) {
        throw createHttpError(400, 'Invalid planId');
      }

      const existingPlan = PlanModel.findById(workoutData.plan);
      if (workoutData.plan && !existingPlan) {
        throw createHttpError(404, 'Plan not found');
      }
    }

    for (const exercise of workoutData.exercises) {
      if (!Types.ObjectId.isValid(exercise.exerciseId)) {
        throw createHttpError(400, 'Invalid exerciseId');
      }

      const existingExercise = await ExerciseModel.findById(
        exercise.exerciseId
      );
      if (!existingExercise) {
        throw createHttpError(
          404,
          `Exercise not found: ${exercise.exerciseId}`
        );
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

    if (workout.plan) {
      await PlanModel.findByIdAndUpdate(
        workout.plan,
        { $push: { workouts: workout._id } },
        { new: true }
      );
    }

    if (!workout) {
      throw createHttpError(500, 'Failed to create workout');
    }

    return workout;
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

    if (workoutData.plan) {
      if (!Types.ObjectId.isValid(workoutData.plan)) {
        throw createHttpError(400, 'Invalid planId');
      }

      const existingPlan = PlanModel.findById(workoutData.plan);
      if (workoutData.plan && !existingPlan) {
        throw createHttpError(404, 'Plan not found');
      }
    }

    if (workoutData.exercises) {
      for (const exercise of workoutData.exercises) {
        if (!Types.ObjectId.isValid(exercise.exerciseId)) {
          throw createHttpError(400, 'Invalid exerciseId');
        }

        const existingExercise = await ExerciseModel.findById(
          exercise.exerciseId
        );
        if (!existingExercise) {
          throw createHttpError(
            404,
            `Exercise not found: ${exercise.exerciseId}`
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
    )
      .populate('user')
      .populate('plan');

    if (!updatedWorkout) {
      throw createHttpError(500, 'Failed to update workout');
    }

    return updatedWorkout;
  },

  remove: async (workoutId: string) => {
    if (!Types.ObjectId.isValid(workoutId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const workout = await WorkoutModel.findByIdAndDelete(workoutId);

    if (!workout) {
      throw createHttpError(404, 'Workout not found');
    }

    if (workout.plan) {
      await PlanModel.findByIdAndUpdate(
        workout.plan,
        { $pull: { workouts: workout._id } },
        { new: true }
      );
    }
    return workout;
  }
};

export default WorkoutService;
