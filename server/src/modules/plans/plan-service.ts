import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { uploadImage } from '~/utils/cloudinary';

import UserModel from '../users/user-model';
import WorkoutModel from '../workouts/workout-model';
import PlanModel from './plan-model';
import { IPlan } from './plan-type';

const PlanService = {
  findAll: async () => {
    const plans = await PlanModel.find().populate('user').populate('workouts');
    return plans;
  },

  findById: async (planId: string) => {
    if (!Types.ObjectId.isValid(planId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const plan = await PlanModel.findById(planId)
      .populate('user')
      .populate('workouts');

    if (!plan) {
      throw createHttpError(404, 'Plan not found');
    }

    return plan;
  },

  findByUser: async (userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const plan = await PlanModel.findOne({ user: userId })
      .populate('user')
      .populate('workouts');

    if (!plan) {
      throw createHttpError(404, 'Plan not found');
    }

    return plan;
  },

  create: async (planData: IPlan, file?: Express.Multer.File) => {
    if (!Types.ObjectId.isValid(planData.user)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const existingUser = await UserModel.findById(planData.user);
    if (!existingUser) {
      throw createHttpError(404, 'User not found');
    }

    for (const workout of planData.workouts) {
      if (!Types.ObjectId.isValid(workout)) {
        throw createHttpError(400, 'Invalid workoutId');
      }

      const existingWorkout = await WorkoutModel.findById(workout);
      if (!existingWorkout) {
        throw createHttpError(404, `Workout not found: ${workout}`);
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

    const newPlanData = { ...planData, image: imageUrl };

    const newPlan = await PlanModel.create(newPlanData);

    if (!newPlan) {
      throw createHttpError(500, 'Failed to create plan');
    }

    return newPlan;
  },

  update: async (
    planId: string,
    planData: Partial<IPlan>,
    file?: Express.Multer.File
  ) => {
    if (!Types.ObjectId.isValid(planId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    if (planData.user && !Types.ObjectId.isValid(planData.user)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const existingUser = await UserModel.findById(planData.user);
    if (planData.user && !existingUser) {
      throw createHttpError(404, 'User not found');
    }

    if (planData.workouts) {
      for (const workout of planData.workouts) {
        if (!Types.ObjectId.isValid(workout)) {
          throw createHttpError(400, 'Invalid workoutId');
        }

        const existingWorkout = await WorkoutModel.findById(workout);
        if (!existingWorkout) {
          throw createHttpError(404, `Workout not found: ${workout}`);
        }
      }
    }

    const existingPlan = await PlanModel.findById(planId);
    if (!existingPlan) {
      throw createHttpError(404, 'Plan not found');
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

    const updatedPlanData = {
      ...planData,
      image: existingPlan.image || imageUrl
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

    return updatedPlan;
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
