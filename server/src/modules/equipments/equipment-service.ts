import createHttpError from 'http-errors';

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
    const equipment = await EquipmentModel.findById(equipmentId);
    if (!equipment) {
      throw createHttpError(404, 'Equipment not found');
    }

    return equipment;
  },
  create: async (equipmentData: IEquipment) => {
    const existingEquipment = await EquipmentModel.findOne({
      title: equipmentData.title
    });
    if (existingEquipment) {
      throw createHttpError(409, 'Equipment with this title already exists');
    }

    const newEquipment = EquipmentModel.create(equipmentData);
    if (!newEquipment) {
      throw createHttpError(500, 'Failed to create equipment');
    }

    return newEquipment;
  },
  update: async (equipmentId: string, equipmentData: Partial<IEquipment>) => {
    const equipment = await EquipmentModel.findById(equipmentId);
    if (!equipment) {
      throw createHttpError(404, 'Equipment not found');
    }

    const updatedEquipment = await EquipmentModel.findByIdAndUpdate(
      equipmentId,
      equipmentData,
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
    const equipment = await EquipmentModel.findByIdAndDelete(equipmentId);
    if (!equipment) {
      throw createHttpError(404, 'Equipment not found');
    }
  }
};

export default EquipmentService;
