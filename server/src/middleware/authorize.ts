import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import { IUser } from '~/modules/users/user-type';

const authorize =
  (allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw createHttpError(401, 'Unauthenticated');
    }

    const user = req.user as IUser;

    if (!allowedRoles.includes(user.role)) {
      throw createHttpError(403, 'Forbidden');
    }

    next();
  };

export default authorize;
