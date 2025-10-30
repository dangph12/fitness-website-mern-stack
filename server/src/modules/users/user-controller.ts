import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';
import { generateToken } from '~/utils/jwt';

import UserService from './user-service';

const UserController = {
  find: async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
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
    const newUser = await UserService.create(userData, req.file);
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
  findByEmail: async (req: Request, res: Response) => {
    const email = req.params.email;
    const user = await UserService.findByEmail(email);
    return res
      .status(200)
      .json(ApiResponse.success('User retrieved successfully', user));
  },
  refreshMembershipTokens: async (req: Request, res: Response) => {
    const userId = req.params.id;
    const user = await UserService.refreshMembershipTokens(userId);
    return res
      .status(200)
      .json(
        ApiResponse.success('Membership tokens refreshed successfully', user)
      );
  },
  update: async (req: Request, res: Response) => {
    const userId = req.params.id;
    const updateData = req.body;
    const updatedUser = await UserService.update(userId, updateData, req.file);
    return res
      .status(200)
      .json(ApiResponse.success('User updated successfully', updatedUser));
  },
  remove: async (req: Request, res: Response) => {
    const userId = req.params.id;
    await UserService.remove(userId);
    return res
      .status(200)
      .json(ApiResponse.success('User deleted successfully'));
  },
  updateAvatar: async (req: Request, res: Response) => {
    const userId = req.params.id;
    const avatar = await UserService.updateAvatar(userId, req.file);
    return res
      .status(200)
      .json(ApiResponse.success('Avatar updated successfully', { avatar }));
  },
  completeOnboarding: async (req: Request, res: Response) => {
    const user = req.user as any;
    const userId = user._id || user.id;
    const onboardingData = req.body;

    const result = await UserService.completeOnboarding(userId, onboardingData);

    const { accessToken } = generateToken({
      id: result.user._id.toString(),
      role: result.user.role,
      profileCompleted: result.user.profileCompleted
    });

    return res.status(200).json(
      ApiResponse.success('Onboarding completed successfully', {
        accessToken
      })
    );
  }
};

export default UserController;
