import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { uploadImage } from '~/utils/cloudinary';

import EquipmentModel from './equipment-model';
import { IEquipment } from './equipment-type';

const EquipmentService = {
  findAll: async () => {
    const equipments = await EquipmentModel.find();
    if (!equipments) {
      throw createHttpError(404, 'No equipments found');
    }

    return equipments;
  },

  findById: async (equipmentId: string) => {
    if (!Types.ObjectId.isValid(equipmentId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const equipment = await EquipmentModel.findById(equipmentId);

    if (!equipment) {
      throw createHttpError(404, 'Equipment not found');
    }

    return equipment;
  },

  create: async (equipmentData: IEquipment, file?: Express.Multer.File) => {
    if (!file) {
      return createHttpError(400, 'No file provided');
    }

    const existingEquipment = await EquipmentModel.findOne({
      title: equipmentData.title
    });
    if (existingEquipment) {
      throw createHttpError(409, 'Equipment with this title already exists');
    }

    const uploadResult = await uploadImage(file.buffer);

    if (!uploadResult.success || !uploadResult.data) {
      throw createHttpError(
        500,
        uploadResult.error || 'Failed to upload image'
      );
    }

    const imageUrl = uploadResult.data.secure_url;

    const newEquipmentData = { ...equipmentData, image: imageUrl };

    const newEquipment = await EquipmentModel.create(newEquipmentData);
    if (!newEquipment) {
      throw createHttpError(500, 'Failed to create equipment');
    }

    return newEquipment;
  },

  update: async (
    equipmentId: string,
    equipmentData: Partial<IEquipment>,
    file?: Express.Multer.File
  ) => {
    if (!Types.ObjectId.isValid(equipmentId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const existingEquipment = await EquipmentModel.findById(equipmentId);
    if (!existingEquipment) {
      throw createHttpError(404, 'Equipment not found');
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

    const updatedEquipmentData = {
      ...equipmentData,
      image: imageUrl || existingEquipment.image
    };

    const updatedEquipment = await EquipmentModel.findByIdAndUpdate(
      equipmentId,
      updatedEquipmentData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedEquipment) {
      throw createHttpError(500, 'Failed to update equipment');
    }

    return updatedEquipment;
  },

  remove: async (equipmentId: string) => {
    if (!Types.ObjectId.isValid(equipmentId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const equipment = await EquipmentModel.findByIdAndDelete(equipmentId);

    if (!equipment) {
      throw createHttpError(404, 'Equipment not found');
    }
  }
};

export default EquipmentService;
