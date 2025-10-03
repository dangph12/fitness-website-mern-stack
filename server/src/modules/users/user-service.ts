import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { deleteAvatar, uploadAvatar } from '~/utils/cloudinary';
import { uploadImage } from '~/utils/cloudinary';

import UserModel from './user-model';
import { IUser } from './user-type';

const UserService = {
  find: async ({
    page = 1,
    limit = 10,
    filterParams = {},
    sortBy = 'createdAt',
    sortOrder = 'desc'
  }) => {
    const filterRecord: Record<string, any> = {};

    for (const [key, value] of Object.entries(filterParams)) {
      if (value && value !== '') {
        // options for case-insensitive
        filterRecord[key] = { $regex: value, $options: 'i' };
      }
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 } as any;

    const totalUsers = await UserModel.countDocuments(filterRecord);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await UserModel.find(filterRecord)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return {
      users,
      totalUsers,
      totalPages
    };
  },

  findById: async (userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    return user;
  },

  findByEmail: async (email: string) => {
    if (!email) {
      throw createHttpError(400, 'Email is required');
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    return user;
  },

  create: async (userData: IUser, file?: Express.Multer.File) => {
    if (!file) {
      throw createHttpError(400, 'No file provided');
    }

    const uploadResult = await uploadImage(file.buffer);

    if (!uploadResult.success || !uploadResult.data) {
      throw createHttpError(
        500,
        uploadResult.error || 'Failed to upload image'
      );
    }

    const imageUrl = uploadResult.data.secure_url;

    const newUserData = { ...userData, avatar: imageUrl };

    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw createHttpError(400, 'User with this email already exists');
    }

    const newUser = UserModel.create({
      ...newUserData,
      isActive: true
    });

    if (!newUser) {
      throw createHttpError(500, 'Failed to create user');
    }

    return newUser;
  },

  update: async (
    userId: string,
    updateData: Partial<IUser>,
    file?: Express.Multer.File
  ) => {
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw createHttpError(404, 'User not found');
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

    const updateUserData = {
      ...updateData,
      avatar: imageUrl || existingUser.avatar
    };

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateUserData,
      {
        new: true,
        runValidators: true
      }
    );

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
