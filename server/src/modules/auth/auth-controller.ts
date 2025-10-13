import { Request, Response } from 'express';
import { Document } from 'mongoose';

import ApiResponse from '~/types/api-response';
import { generateToken } from '~/utils/jwt';

import { IUser } from '../users/user-type';
import AuthService from './auth-service';

const AuthController = {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await AuthService.login(
      email,
      password,
      'user'
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return res.status(200).json(
      ApiResponse.success('User logged in successfully', {
        accessToken
      })
    );
  },
  signUp: async (req: Request, res: Response) => {
    const { password, confirmPassword, ...userData } = req.body;
    const avatar = req.file;

    const { user, accessToken, refreshToken } = await AuthService.signUp(
      userData,
      password,
      avatar
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return res.status(201).json(
      ApiResponse.success('User signed up successfully', {
        accessToken
      })
    );
  },
  forgotPassword: async (req: Request, res: Response) => {
    const { email } = req.body;

    await AuthService.forgotPassword(email);

    return res
      .status(200)
      .json(ApiResponse.success('Password reset link sent to email'));
  },
  resetPassword: async (req: Request, res: Response) => {
    const { password, confirmPassword } = req.body;
    const { token } = req.query;

    if (typeof token !== 'string') {
      return res.status(400).json(ApiResponse.failed('Invalid reset token'));
    }

    await AuthService.resetPassword(token, password);

    return res
      .status(200)
      .json(ApiResponse.success('Password reset successfully'));
  },
  refreshAccessToken: async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const accessToken = await AuthService.refreshAccessToken(refreshToken);

    return res.status(200).json(
      ApiResponse.success('Token refreshed successfully', {
        accessToken
      })
    );
  },
  logout: async (req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return res.status(200).json({ message: 'User logged out successfully' });
  },
  loginWithProvider: async (req: Request, res: Response) => {
    // This user is from create method, so it has type Document
    console.log('User logged in with provider:', req.user);
    const user = req.user as Document<unknown, object, IUser> & IUser;
    if (!user || !user._id) {
      return res
        .status(400)
        .json(ApiResponse.failed('User not found in controller'));
    }

    const { accessToken, refreshToken } = generateToken({
      id: user._id.toString(),
      role: user.role,
      profileCompleted: user.profileCompleted
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?accessToken=${accessToken}`
    );
  },
  loginByAdmin: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await AuthService.login(
      email,
      password,
      'admin'
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return res.status(200).json(
      ApiResponse.success('User logged in successfully', {
        accessToken
      })
    );
  }
};

export default AuthController;
