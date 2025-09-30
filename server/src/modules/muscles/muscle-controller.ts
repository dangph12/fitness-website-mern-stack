import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import MuscleService from './muscle-service';

const MuscleController = {
  findAll: async (req: Request, res: Response) => {
    const muscles = await MuscleService.findAll();

    return res
      .status(200)
      .json(ApiResponse.success('Muscles retrieved successfully', muscles));
  },

  findById: async (req: Request, res: Response) => {
    const muscleId = req.params.id;
    const muscle = await MuscleService.findById(muscleId);
    return res
      .status(200)
      .json(ApiResponse.success('Muscle retrieved successfully', muscle));
  },

  create: async (req: Request, res: Response) => {
    const muscleData = req.body;
    const newMuscle = await MuscleService.create(muscleData, req.file);
    return res
      .status(201)
      .json(ApiResponse.success('Muscle created successfully', newMuscle));
  },

  update: async (req: Request, res: Response) => {
    const muscleId = req.params.id;
    const updateData = req.body;
    const updatedMuscle = await MuscleService.update(muscleId, updateData);
    return res
      .status(200)
      .json(ApiResponse.success('Muscle updated successfully', updatedMuscle));
  },

  remove: async (req: Request, res: Response) => {
    const muscleId = req.params.id;
    await MuscleService.remove(muscleId);
    return res
      .status(204)
      .json(ApiResponse.success('Muscle deleted successfully', null));
  }
};

export default MuscleController;
