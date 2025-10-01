import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import EquipmentService from './equipment-service';

const EquipmentController = {
  findAll: async (req: Request, res: Response) => {
    const equipments = await EquipmentService.findAll();

    return res
      .status(200)
      .json(
        ApiResponse.success('Equipments retrieved successfully', equipments)
      );
  },

  findById: async (req: Request, res: Response) => {
    const equipmentId = req.params.id;
    const equipment = await EquipmentService.findById(equipmentId);
    return res
      .status(200)
      .json(ApiResponse.success('Equipment retrieved successfully', equipment));
  },

  create: async (req: Request, res: Response) => {
    const equipmentData = req.body;
    const newEquipment = await EquipmentService.create(equipmentData, req.file);
    return res
      .status(201)
      .json(
        ApiResponse.success('Equipment created successfully', newEquipment)
      );
  },

  update: async (req: Request, res: Response) => {
    const equipmentId = req.params.id;
    const updateData = req.body;
    const updatedEquipment = await EquipmentService.update(
      equipmentId,
      updateData,
      req.file
    );
    return res
      .status(200)
      .json(
        ApiResponse.success('Equipment updated successfully', updatedEquipment)
      );
  },

  remove: async (req: Request, res: Response) => {
    const equipmentId = req.params.id;
    await EquipmentService.remove(equipmentId);
    return res
      .status(200)
      .json(ApiResponse.success('Equipment deleted successfully'));
  }
};

export default EquipmentController;
