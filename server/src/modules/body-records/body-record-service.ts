import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import UserModel from '../users/user-model';
import BodyRecordModel from './body-record-model';
import { IBodyRecord } from './body-record-type';

const calculateBMI = (height: number, weight: number): number => {
  if (height <= 0 || weight <= 0) {
    throw createHttpError(400, 'Height and weight must be positive numbers');
  }
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(2));
};

const BodyRecordService = {
  findAll: async () => {
    const bodyRecords = await BodyRecordModel.find().populate('user');
    return bodyRecords;
  },

  findById: async (bodyRecordId: string) => {
    if (!Types.ObjectId.isValid(bodyRecordId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const bodyRecord =
      await BodyRecordModel.findById(bodyRecordId).populate('user');

    if (!bodyRecord) {
      throw createHttpError(404, 'Record not found');
    }

    return bodyRecord;
  },

  findByUser: async (userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const bodyRecord = await BodyRecordModel.find({ user: userId }).populate(
      'user'
    );

    if (!bodyRecord) {
      throw createHttpError(404, 'Records not found');
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

    if (bodyRecordData.user && !Types.ObjectId.isValid(bodyRecordData.user)) {
      throw createHttpError(400, 'Invalid userId');
    }

    const user = await UserModel.findById(bodyRecordData.user);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    if (bodyRecordData.height && bodyRecordData.weight) {
      const bmi = calculateBMI(bodyRecordData.height, bodyRecordData.weight);
      bodyRecordData.bmi = bmi;
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
