import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { uploadImage } from '~/utils/cloudinary';

import ExerciseModel from '../exercises/exercise-model';
import UserModel from '../users/user-model';
import WorkoutModel from '../workouts/workout-model';
import PlanModel from './plan-model';
import { ICreatePlan, IPlan } from './plan-type';

const PlanService = {
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
          // options for case-insensitive search for string
          filterRecord[key] = { $regex: value, $options: 'i' };
        }
      }
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as any;

    const totalPlans = await PlanModel.countDocuments(filterRecord);
    const totalPages = Math.ceil(totalPlans / limit);

    const plans = await PlanModel.find(filterRecord)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('user')
      .populate({
        path: 'workouts',
        populate: {
          path: 'exercises.exercise',
          populate: [{ path: 'muscles' }, { path: 'equipments' }]
        }
      });

    return {
      plans,
      totalPlans,
      totalPages
    };
  },

  findById: async (planId: string) => {
    if (!Types.ObjectId.isValid(planId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const plan = await PlanModel.findById(planId)
      .populate('user')
      .populate({
        path: 'workouts',
        populate: {
          path: 'exercises.exercise',
          populate: [{ path: 'muscles' }, { path: 'equipments' }]
        }
      });

    if (!plan) {
      throw createHttpError(404, 'Plan not found');
    }

    return plan;
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
      throw createHttpError(400, 'Invalid userId');
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
          // options for case-insensitive search for string
          filterRecord[key] = { $regex: value, $options: 'i' };
        }
      }
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as any;

    const totalPlans = await PlanModel.countDocuments(filterRecord);
    const totalPages = Math.ceil(totalPlans / limit);

    const plans = await PlanModel.find(filterRecord)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('user')
      .populate({
        path: 'workouts',
        populate: {
          path: 'exercises.exercise',
          populate: [{ path: 'muscles' }, { path: 'equipments' }]
        }
      });

    return {
      plans,
      totalPlans,
      totalPages
    };
  },

  create: async (planData: ICreatePlan, file?: Express.Multer.File) => {
    if (!Types.ObjectId.isValid(planData.user)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const existingUser = await UserModel.findById(planData.user);
    if (!existingUser) {
      throw createHttpError(404, 'User not found');
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

    const workoutIds: Types.ObjectId[] = [];

    for (const workoutData of planData.workouts) {
      if (!Types.ObjectId.isValid(workoutData.user)) {
        throw createHttpError(400, 'Invalid userId in workout');
      }

      for (const exercise of workoutData.exercises) {
        if (!Types.ObjectId.isValid(exercise.exercise)) {
          throw createHttpError(400, 'Invalid exerciseId in workout');
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

      const newWorkout = await WorkoutModel.create({
        title: workoutData.title,
        isPublic: workoutData.isPublic,
        user: workoutData.user,
        exercises: workoutData.exercises
      });

      if (!newWorkout) {
        throw createHttpError(500, 'Failed to create workout');
      }

      workoutIds.push(newWorkout._id);
    }

    const newPlanData = {
      title: planData.title,
      description: planData.description,
      image: imageUrl || '',
      isPublic: planData.isPublic,
      user: planData.user,
      workouts: workoutIds
    };

    const newPlan = await PlanModel.create(newPlanData);

    if (!newPlan) {
      throw createHttpError(500, 'Failed to create plan');
    }

    const populatedPlan = await PlanModel.findById(newPlan._id)
      .populate('user')
      .populate({
        path: 'workouts',
        populate: {
          path: 'exercises.exercise',
          populate: [{ path: 'muscles' }, { path: 'equipments' }]
        }
      });

    if (!populatedPlan) {
      throw createHttpError(500, 'Failed to populate plan');
    }

    return populatedPlan;
  },

  update: async (
    planId: string,
    planData: Partial<ICreatePlan>,
    file?: Express.Multer.File
  ) => {
    if (!Types.ObjectId.isValid(planId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const existingPlan = await PlanModel.findById(planId);
    if (!existingPlan) {
      throw createHttpError(404, 'Plan not found');
    }

    if (planData.user && !Types.ObjectId.isValid(planData.user)) {
      throw createHttpError(400, 'Invalid userId');
    }

    if (planData.user) {
      const existingUser = await UserModel.findById(planData.user);
      if (!existingUser) {
        throw createHttpError(404, 'User not found');
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

    let workoutIds: Types.ObjectId[] = existingPlan.workouts;

    if (planData.workouts && planData.workouts.length > 0) {
      const newWorkoutIds: Types.ObjectId[] = [];

      for (const workoutData of planData.workouts) {
        if (!Types.ObjectId.isValid(workoutData.user)) {
          throw createHttpError(400, 'Invalid userId in workout');
        }

        for (const exercise of workoutData.exercises) {
          if (!Types.ObjectId.isValid(exercise.exercise)) {
            throw createHttpError(400, 'Invalid exerciseId in workout');
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

        // Check if workout has _id (existing workout) or not (new workout)
        const workoutId = (workoutData as any)._id;

        if (workoutId && Types.ObjectId.isValid(workoutId)) {
          const updatedWorkout = await WorkoutModel.findByIdAndUpdate(
            workoutId,
            {
              title: workoutData.title,
              isPublic: workoutData.isPublic ?? false,
              user: workoutData.user,
              exercises: workoutData.exercises
            },
            {
              new: true,
              runValidators: true
            }
          );

          if (!updatedWorkout) {
            throw createHttpError(404, `Workout not found: ${workoutId}`);
          }

          newWorkoutIds.push(updatedWorkout._id);
        } else {
          const newWorkout = await WorkoutModel.create({
            title: workoutData.title,
            isPublic: workoutData.isPublic || false,
            user: workoutData.user,
            exercises: workoutData.exercises
          });

          if (!newWorkout) {
            throw createHttpError(500, 'Failed to create workout');
          }

          newWorkoutIds.push(newWorkout._id);
        }
      }

      workoutIds = newWorkoutIds;
    }

    const updatedPlanData: any = {
      title: planData.title ?? existingPlan.title,
      description: planData.description ?? existingPlan.description,
      isPublic: planData.isPublic ?? existingPlan.isPublic,
      user: planData.user ?? existingPlan.user,
      image: imageUrl || existingPlan.image,
      workouts: workoutIds
    };

    const updatedPlan = await PlanModel.findByIdAndUpdate(
      planId,
      updatedPlanData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedPlan) {
      throw createHttpError(500, 'Failed to update plan');
    }

    const populatedPlan = await PlanModel.findById(planId)
      .populate('user')
      .populate({
        path: 'workouts',
        populate: {
          path: 'exercises.exercise',
          populate: [{ path: 'muscles' }, { path: 'equipments' }]
        }
      });

    if (!populatedPlan) {
      throw createHttpError(500, 'Failed to populate plan');
    }

    return populatedPlan;
  },

  remove: async (planId: string) => {
    if (!Types.ObjectId.isValid(planId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const plan = await PlanModel.findByIdAndDelete(planId);

    if (!plan) {
      throw createHttpError(404, 'Plan not found');
    }
  }
};

export default PlanService;
