import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import BodyClassificationModel from './body-classification-model';
import { IBodyClassification } from './body-classification-type';

const BodyClassificationService = {
  findAll: async () => {
    const bodyClassifications = await BodyClassificationModel.find();

    return bodyClassifications;
  },

  findById: async (bodyClassificationId: string) => {
    if (!Types.ObjectId.isValid(bodyClassificationId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const bodyClassification =
      await BodyClassificationModel.findById(bodyClassificationId);

    if (!bodyClassification) {
      throw createHttpError(404, 'Body classification not found');
    }

    return bodyClassification;
  },

  create: async (bodyClassificationData: IBodyClassification) => {
    const existingBodyClassification = await BodyClassificationModel.findOne({
      title: bodyClassificationData.title
    });
    if (existingBodyClassification) {
      throw createHttpError(
        409,
        'Body classification with this title already exists'
      );
    }

    if (
      bodyClassificationData.weightFactor.min >=
      bodyClassificationData.weightFactor.max
    ) {
      throw createHttpError(400, 'Invalid range of weightFactor');
    }

    const newBodyClassification = await BodyClassificationModel.create(
      bodyClassificationData
    );
    if (!newBodyClassification) {
      throw createHttpError(500, 'Failed to create body classification');
    }

    return newBodyClassification;
  },

  update: async (
    bodyClassificationId: string,
    updateData: Partial<IBodyClassification>
  ) => {
    if (!Types.ObjectId.isValid(bodyClassificationId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const existingBodyClassification =
      await BodyClassificationModel.findById(bodyClassificationId);
    if (!existingBodyClassification) {
      throw createHttpError(404, 'Body classification not found');
    }

    if (
      updateData.weightFactor &&
      updateData.weightFactor?.min >= updateData.weightFactor?.max
    ) {
      throw createHttpError(400, 'Invalid range of weightFactor');
    }

    const updatedBodyClassification =
      await BodyClassificationModel.findByIdAndUpdate(
        bodyClassificationId,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedBodyClassification) {
      throw createHttpError(500, 'Failed to update body classification');
    }

    return updatedBodyClassification;
  },

  remove: async (bodyClassificationId: string) => {
    if (!Types.ObjectId.isValid(bodyClassificationId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const bodyClassification =
      await BodyClassificationModel.findByIdAndDelete(bodyClassificationId);

    if (!bodyClassification) {
      throw createHttpError(404, 'Body classification not found');
    }
  }
};

export default BodyClassificationService;
