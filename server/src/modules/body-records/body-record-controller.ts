import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import BodyRecordService from './body-record-service';

const BodyRecordController = {
  findAll: async (req: Request, res: Response) => {
    const bodyRecords = await BodyRecordService.findAll();

    return res
      .status(200)
      .json(
        ApiResponse.success('Body records retrieved successfully', bodyRecords)
      );
  },

  findById: async (req: Request, res: Response) => {
    const bodyRecordId = req.params.id;
    const bodyRecord = await BodyRecordService.findById(bodyRecordId);
    return res
      .status(200)
      .json(
        ApiResponse.success('Body record retrieved successfully', bodyRecord)
      );
  },

  findByUser: async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const bodyRecords = await BodyRecordService.findByUser(userId);
    return res
      .status(200)
      .json(
        ApiResponse.success('Body records retrieved successfully', bodyRecords)
      );
  },

  update: async (req: Request, res: Response) => {
    const bodyRecordId = req.params.id;
    const updateData = req.body;
    const updatedBodyRecord = await BodyRecordService.update(
      bodyRecordId,
      updateData
    );
    return res
      .status(200)
      .json(
        ApiResponse.success(
          'Body record updated successfully',
          updatedBodyRecord
        )
      );
  },

  remove: async (req: Request, res: Response) => {
    const bodyRecordId = req.params.id;
    await BodyRecordService.remove(bodyRecordId);
    return res
      .status(200)
      .json(ApiResponse.success('Body record deleted successfully'));
  }
};

export default BodyRecordController;
