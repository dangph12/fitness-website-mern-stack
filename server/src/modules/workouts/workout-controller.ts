import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import WorkoutService from './workout-service';

const WorkoutController = {
  find: async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      ...filterParams
    } = req.query;

    const workouts = await WorkoutService.find({
      page: Number(page),
      limit: Number(limit),
      filterParams: filterParams,
      sortBy: sortBy as string,
      sortOrder: sortOrder as string
    });
    return res
      .status(200)
      .json(ApiResponse.success('Plans retrieved successfully', workouts));
  },

  findAll: async (req: Request, res: Response) => {
    const workouts = await WorkoutService.findAll();

    return res
      .status(200)
      .json(ApiResponse.success('Workouts retrieved successfully', workouts));
  },

  findById: async (req: Request, res: Response) => {
    const workoutId = req.params.id;
    const workout = await WorkoutService.findById(workoutId);

    return res
      .status(200)
      .json(ApiResponse.success('Workout retrieved successfully', workout));
  },

  findByUser: async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const workouts = await WorkoutService.findByUser(userId);

    return res
      .status(200)
      .json(ApiResponse.success('Workouts retrieved successfully', workouts));
  },

  create: async (req: Request, res: Response) => {
    const workoutData = req.body;
    const newWorkout = await WorkoutService.create(workoutData, req.file);

    return res
      .status(201)
      .json(ApiResponse.success('Workout created successfully', newWorkout));
  },

  update: async (req: Request, res: Response) => {
    const workoutId = req.params.id;
    const updateData = req.body;
    const updatedWorkout = await WorkoutService.update(
      workoutId,
      updateData,
      req.file
    );

    return res
      .status(200)
      .json(
        ApiResponse.success('Workout updated successfully', updatedWorkout)
      );
  },

  remove: async (req: Request, res: Response) => {
    const workoutId = req.params.id;
    await WorkoutService.remove(workoutId);

    return res
      .status(200)
      .json(ApiResponse.success('Workout deleted successfully'));
  }
};

export default WorkoutController;
