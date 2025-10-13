import createHttpError from 'http-errors';
import { Document } from 'mongoose';

import AuthModel from '~/modules/auth/auth-model';
import { comparePassword, hashPassword } from '~/utils/bcrypt';
import { uploadAvatar } from '~/utils/cloudinary';
import { sendMail } from '~/utils/email/mailer';
import {
  generateResetPasswordToken,
  generateToken,
  verifyToken
} from '~/utils/jwt';

import UserService from '../users/user-service';
import { IUser } from '../users/user-type';

const AuthService = {
  login: async (email: string, password: string, role: string) => {
    const user = await UserService.findByEmail(email);

    const auth = await AuthModel.findOne({ user: user._id, provider: 'local' });

    if (!auth || !auth.localPassword) {
      throw createHttpError(401, 'Password is incorrect');
    }

    const isPasswordValid = await comparePassword(password, auth.localPassword);

    if (!isPasswordValid || user.role !== role) {
      throw createHttpError(401, 'Username or password is incorrect');
    }

    if (!user.isActive) {
      throw createHttpError(403, 'User account is deactivated');
    }

    const { accessToken, refreshToken } = generateToken({
      id: user._id.toString(),
      role: user.role,
      profileCompleted: user.profileCompleted
    });

    return {
      user,
      accessToken,
      refreshToken
    };
  },
  signUp: async (
    userData: IUser,
    password: string,
    avatarFile?: Express.Multer.File
  ) => {
    const user = await UserService.create(userData, avatarFile);

    const hashedPassword = await hashPassword(password);

    await AuthModel.create({
      user: user._id,
      provider: 'local',
      providerId: user.email,
      localPassword: hashedPassword
    });

    const { accessToken, refreshToken } = generateToken({
      id: user._id.toString(),
      role: user.role,
      profileCompleted: user.profileCompleted
    });

    return {
      user,
      accessToken,
      refreshToken
    };
  },
  forgotPassword: async (email: string) => {
    const user = await UserService.findByEmail(email);

    const resetToken = generateResetPasswordToken(user._id.toString());

    await sendMail({
      to: user.email,
      subject: 'Password Reset',
      template: 'password-reset',
      templateData: {
        name: user.name,
        resetUrl: `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`
      }
    });
  },
  resetPassword: async (token: string, newPassword: string) => {
    const decoded = verifyToken(
      token,
      process.env.JWT_RESET_PASSWORD_SECRET || 'your_jwt_secret'
    );

    // If the decoded token is a string, it means the token is invalid
    if (typeof decoded === 'string') {
      throw createHttpError(400, 'Invalid reset password token');
    }

    const user = await UserService.findById(decoded.id);

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const hashedPassword = await hashPassword(newPassword);

    let auth = await AuthModel.findOne({ user: user._id, provider: 'local' });

    if (!auth) {
      auth = await AuthModel.create({
        user: user._id,
        provider: 'local',
        providerId: user.email,
        localPassword: hashedPassword
      });
      return;
    }

    auth.localPassword = hashedPassword;
    await auth.save();
  },
  refreshAccessToken: async (refreshToken: string) => {
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token is required');
    }

    const decoded = verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'your_jwt_secret'
    );

    // If the decoded token is a string, it means the token is invalid
    if (typeof decoded === 'string') {
      throw createHttpError(400, 'Invalid refresh token');
    }

    const user = await UserService.findById(decoded.id);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const { accessToken } = generateToken({
      id: user._id.toString(),
      role: user.role,
      profileCompleted: user.profileCompleted
    });

    return accessToken;
  },
  loginWithProvider: async (
    provider: string,
    providerId: string,
    user: Document<unknown, object, IUser> & IUser
  ) => {
    let auth = await AuthModel.findOne({ provider, providerId });

    if (!auth) {
      auth = await AuthModel.create({
        user: user._id,
        provider,
        providerId,
        verifyAt: new Date()
      });
    } else {
      auth.verifyAt = new Date();
      await auth.save();
    }

    return auth;
  }
};

export default AuthService;
