import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import ExerciseService from './exercise-service';

const ExerciseController = {
  find: async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ...filterParams
    } = req.query;

    const exercises = await ExerciseService.find({
      page: Number(page),
      limit: Number(limit),
      filterParams: filterParams,
      sortBy: sortBy as string,
      sortOrder: sortOrder as string
    });

    return res
      .status(200)
      .json(ApiResponse.success('Exercises retrieved successfully', exercises));
  },

  findAll: async (req: Request, res: Response) => {
    const exercises = await ExerciseService.findAll();

    return res
      .status(200)
      .json(ApiResponse.success('Exercises retrieved successfully', exercises));
  },

  findById: async (req: Request, res: Response) => {
    const exerciseId = req.params.id;
    const exercise = await ExerciseService.findById(exerciseId);
    return res
      .status(200)
      .json(ApiResponse.success('Exercise retrieved successfully', exercise));
  },

  create: async (req: Request, res: Response) => {
    const exerciseData = req.body;
    const newExercise = await ExerciseService.create(exerciseData, req.file);
    return res
      .status(201)
      .json(ApiResponse.success('Exercise created successfully', newExercise));
  },

  update: async (req: Request, res: Response) => {
    const exerciseId = req.params.id;
    const updateData = req.body;
    const updatedExercise = await ExerciseService.update(
      exerciseId,
      updateData,
      req.file
    );
    return res
      .status(200)
      .json(
        ApiResponse.success('Exercise updated successfully', updatedExercise)
      );
  },

  remove: async (req: Request, res: Response) => {
    const exerciseId = req.params.id;
    await ExerciseService.remove(exerciseId);
    return res
      .status(200)
      .json(ApiResponse.success('Exercise deleted successfully'));
  }
};

export default ExerciseController;
