import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import passport from 'passport';

const authenticate = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      'jwt',
      { session: false },
      (
        err: unknown,
        user: Express.User,
        info: { message?: string } | undefined
      ) => {
        if (err) throw createHttpError(500, 'Passport authentication error');
        if (!user) throw createHttpError(401, info?.message || 'Unauthorized');
        req.user = user;
        next();
      }
    )(req, res, next);
  };
};

export default authenticate;
