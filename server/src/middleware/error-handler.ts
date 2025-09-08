import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import isHttpError from 'http-errors';

import ApiResponse from '~/types/api-response';

const errorHandler: ErrorRequestHandler = (
  err: isHttpError.HttpError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = isHttpError.isHttpError(err) ? err.status : 500;

  if (err instanceof Error && err.message === 'Token expired') {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }
  if (status >= 400 && status < 500) {
    const message = err.message || 'Client Error';
    res.status(status).json(ApiResponse.failed(message));
    return;
  }

  const message =
    process.env.NODE_ENV === 'production' && err instanceof Error
      ? 'Internal Server Error'
      : err.message;

  console.error(err);

  res.status(500).json(ApiResponse.error(message));
};

export default errorHandler;
