import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { uploadImage } from '~/utils/cloudinary';

import BodyRecordModel from './body-record-model';
import { IBodyRecord } from './body-record-type';

const BodyRecordService = {
  findAll: async () => {
    const bodyRecords = await BodyRecordModel.find()
      .populate('userId')
      .populate('bodyClassification');

    return bodyRecords;
  },

  findById: async (bodyRecordId: string) => {
    if (!Types.ObjectId.isValid(bodyRecordId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const bodyRecord = await BodyRecordModel.findById(bodyRecordId);

    if (!bodyRecord) {
      throw createHttpError(404, 'Record not found');
    }

    return bodyRecord;
  },

  findByUser: async (userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const bodyRecord = await BodyRecordModel.find({ userId })
      .populate('userId')
      .populate('bodyClassification');

    if (!bodyRecord) {
      throw createHttpError(404, 'Records not found');
    }

    return bodyRecord;
  },

  create: async (bodyRecordData: IBodyRecord) => {
    if (!Types.ObjectId.isValid(bodyRecordData.userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    if (!Types.ObjectId.isValid(bodyRecordData.bodyClassificationId)) {
      throw createHttpError(400, 'Invalid bodyClassificationId');
    }

    const bodyRecord = await BodyRecordModel.create(bodyRecordData);

    if (!bodyRecord) {
      throw createHttpError(500, 'Failed to create record');
    }

    return bodyRecord;
  },

  update: async (
    bodyRecordId: string,
    bodyRecordData: Partial<IBodyRecord>
  ) => {
    if (!Types.ObjectId.isValid(bodyRecordId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    if (
      bodyRecordData.userId &&
      !Types.ObjectId.isValid(bodyRecordData.userId)
    ) {
      throw createHttpError(400, 'Invalid userId');
    }

    if (
      bodyRecordData.bodyClassificationId &&
      !Types.ObjectId.isValid(bodyRecordData.bodyClassificationId)
    ) {
      throw createHttpError(400, 'Invalid bodyClassificationId');
    }

    const bodyRecord = await BodyRecordModel.findByIdAndUpdate(
      bodyRecordId,
      bodyRecordData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!bodyRecord) {
      throw createHttpError(500, 'Failed to update record');
    }

    return bodyRecord;
  },

  remove: async (bodyRecordId: string) => {
    if (!Types.ObjectId.isValid(bodyRecordId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const bodyRecord = await BodyRecordModel.findByIdAndDelete(bodyRecordId);

    if (!bodyRecord) {
      throw createHttpError(404, 'Record not found');
    }
  }
};

export default BodyRecordService;
