import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import BodyClassificationService from './body-classification-service';

const BodyClassificationController = {
  findAll: async (req: Request, res: Response) => {
    const bodyClassifications = await BodyClassificationService.findAll();

    return res
      .status(200)
      .json(
        ApiResponse.success(
          'Body classifications retrieved successfully',
          bodyClassifications
        )
      );
  },

  findById: async (req: Request, res: Response) => {
    const bodyClassificationId = req.params.id;
    const bodyClassification =
      await BodyClassificationService.findById(bodyClassificationId);
    return res
      .status(200)
      .json(
        ApiResponse.success(
          'Body classification retrieved successfully',
          bodyClassification
        )
      );
  },

  create: async (req: Request, res: Response) => {
    const bodyClassificationData = req.body;
    const newBodyClassification = await BodyClassificationService.create(
      bodyClassificationData
    );
    return res
      .status(201)
      .json(
        ApiResponse.success(
          'Body classification created successfully',
          newBodyClassification
        )
      );
  },

  update: async (req: Request, res: Response) => {
    const bodyClassificationId = req.params.id;
    const updateData = req.body;
    const updatedBodyClassification = await BodyClassificationService.update(
      bodyClassificationId,
      updateData
    );
    return res
      .status(200)
      .json(
        ApiResponse.success(
          'Body classification updated successfully',
          updatedBodyClassification
        )
      );
  },

  remove: async (req: Request, res: Response) => {
    const bodyClassificationId = req.params.id;
    await BodyClassificationService.remove(bodyClassificationId);
    return res
      .status(200)
      .json(ApiResponse.success('Body classification deleted successfully'));
  }
};

export default BodyClassificationController;
