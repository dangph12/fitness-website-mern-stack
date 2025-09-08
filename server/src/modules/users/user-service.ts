import createHttpError from 'http-errors';

import { deleteAvatar, uploadAvatar } from '~/utils/cloudinary';

import UserModel from './user-model';
import { IUser } from './user-type';

const UserService = {
  find: async ({
    page = 1,
    limit = 10,
    filter = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  }) => {
    const filterRecord: Record<string, { $regex: string; $options: string }> =
      {};

    if (filter) {
      filter.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value) {
          // Use regex for case-insensitive search
          filterRecord[key] = { $regex: value, $options: 'i' };
        }
      });
    }

    const users = await UserModel.find({
      page,
      limit,
      filterRecord,
      sortBy,
      sortOrder
    });

    if (!users || users.length === 0) {
      throw createHttpError(404, 'Not found users');
    }

    return users;
  },
  findById: async (userId: string) => {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    return user;
  },
  findByEmail: async (email: string) => {
    const user = await UserModel.findOne({
      email: email
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    return user;
  },
  create: async (userData: IUser) => {
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw createHttpError(400, 'User with this email already exists');
    }

    const newUser = UserModel.create({
      ...userData,
      isActive: true
    });

    if (!newUser) {
      throw createHttpError(500, 'Failed to create user');
    }

    return newUser;
  },
  update: async (userId: string, updateData: Partial<IUser>) => {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    return updatedUser;
  },
  remove: async (userId: string) => {
    const user = await UserModel.findById(userId);
    if (user && user.avatar) {
      await deleteAvatar(userId);
    }
    await user?.deleteOne();
  },
  updateAvatar: async (userId: string, file?: Express.Multer.File) => {
    if (!file) {
      throw createHttpError(400, 'No file provided');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    if (user.avatar) {
      await deleteAvatar(userId);
    }

    const uploadResult = await uploadAvatar(file.buffer, userId);

    if (!uploadResult.success || !uploadResult.data) {
      throw createHttpError(
        500,
        uploadResult.error || 'Failed to upload avatar'
      );
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { avatar: uploadResult.data.secure_url },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw createHttpError(500, 'Failed to update user avatar');
    }

    return uploadResult.data.secure_url;
  }
};

export default UserService;
