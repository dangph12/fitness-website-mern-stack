import { NextFunction, Request, Response } from 'express';

/**
 * @description Async handler to catch errors in async routes
 * @param fn - The async function to handle
 * @returns A function that takes req, res, and next as arguments
 */
export const asyncHandler =
  (
    fn: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<unknown> | unknown
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(error => {
      next(error);
    });
  };

export default asyncHandler;
