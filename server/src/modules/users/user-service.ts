import crypto from 'crypto';
import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import { hashPassword } from '~/utils/bcrypt';
import { deleteAvatar, uploadAvatar } from '~/utils/cloudinary';
import { uploadImage } from '~/utils/cloudinary';
import { sendMail } from '~/utils/email/mailer';

import AuthModel from '../auth/auth-model';
import BodyRecordModel from '../body-records/body-record-model';
import { userMembershipService } from './user-membership-service';
import GoalModel from '../goals/goal-model';
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

    await userMembershipService.refreshMembership(userId);

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

    return userMembershipService.refreshMembership(user._id);
  },

  refreshMembershipTokens: async (userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    return userMembershipService.forceRefreshTokens(userId);
  },

  createFromSignUp: async (userData: IUser, avatar?: Express.Multer.File) => {
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw createHttpError(400, 'User with this email already exists');
    }

    const newUser = await UserModel.create({
      ...userData,
      isActive: true
    });

    if (avatar) {
      const uploadResult = await uploadAvatar(
        avatar.buffer,
        newUser._id.toString()
      );
      if (uploadResult.success && uploadResult.data) {
        newUser.avatar = uploadResult.data.secure_url;
        await newUser.save();
      }
    }

    if (!newUser) {
      throw createHttpError(500, 'Failed to create user');
    }

    return newUser;
  },

  create: async (userData: IUser, avatar?: Express.Multer.File) => {
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw createHttpError(400, 'User with this email already exists');
    }

    const password = crypto.randomBytes(4).toString('hex');

    const newUser = await UserModel.create({
      password,
      ...userData,
      isActive: true
    });

    const hashedPassword = await hashPassword(password);
    await AuthModel.create({
      user: newUser._id,
      provider: 'local',
      providerId: newUser.email,
      localPassword: hashedPassword
    });

    await sendMail({
      to: userData.email,
      subject: 'Login Credentials for F-Fitness',
      text: `Hello ${userData.name},\n\nYour account has been created successfully. Your password is: ${password}\n\nPlease change your password after logging in.\n\nBest regards,\nF-Fitness Team`
    });

    if (avatar) {
      const uploadResult = await uploadAvatar(
        avatar.buffer,
        newUser._id.toString()
      );
      if (uploadResult.success && uploadResult.data) {
        newUser.avatar = uploadResult.data.secure_url;
        await newUser.save();
      }
    }

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
  },

  completeOnboarding: async (
    userId: string,
    onboardingData: {
      dob: Date;
      gender: string;
      height: number;
      weight: number;
      bmi: number;
      targetWeight: number;
      diet: string;
      fitnessGoal: string;
    }
  ) => {
    if (!Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, 'Invalid ObjectId');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    if (user.profileCompleted) {
      throw createHttpError(400, 'Profile already completed');
    }

    user.dob = onboardingData.dob;
    user.gender = onboardingData.gender;
    user.profileCompleted = true;
    await user.save();

    const bodyRecord = await BodyRecordModel.create({
      user: userId,
      height: onboardingData.height,
      weight: onboardingData.weight,
      bmi: onboardingData.bmi
    });

    const goal = await GoalModel.create({
      user: userId,
      targetWeight: onboardingData.targetWeight,
      diet: onboardingData.diet,
      fitnessGoal: onboardingData.fitnessGoal
    });

    return {
      user,
      bodyRecord,
      goal
    };
  }
};

export default UserService;
