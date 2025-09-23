import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import UserService from './user-service';

const UserController = {
  find: async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      ...filterParams
    } = req.query;

    const users = await UserService.find({
      page: Number(page),
      limit: Number(limit),
      filterParams: filterParams,
      sortBy: sortBy as string,
      sortOrder: sortOrder as string
    });
    return res
      .status(200)
      .json(ApiResponse.success('Users retrieved successfully', users));
  },
  create: async (req: Request, res: Response) => {
    const userData = req.body;
    const newUser = await UserService.create(userData);
    return res
      .status(201)
      .json(ApiResponse.success('User created successfully', newUser));
  },
  findById: async (req: Request, res: Response) => {
    const userId = req.params.id;
    const user = await UserService.findById(userId);
    return res
      .status(200)
      .json(ApiResponse.success('User retrieved successfully', user));
  },
  update: async (req: Request, res: Response) => {
    const userId = req.params.id;
    const updateData = req.body;
    const updatedUser = await UserService.update(userId, updateData);
    return res
      .status(200)
      .json(ApiResponse.success('User updated successfully', updatedUser));
  },
  remove: async (req: Request, res: Response) => {
    const userId = req.params.id;
    await UserService.remove(userId);
    return res
      .status(204)
      .json(ApiResponse.success('User deleted successfully', null));
  },
  updateAvatar: async (req: Request, res: Response) => {
    const userId = req.params.id;
    const avatar = await UserService.updateAvatar(userId, req.file);
    return res
      .status(200)
      .json(ApiResponse.success('Avatar updated successfully', { avatar }));
  }
};

export default UserController;
