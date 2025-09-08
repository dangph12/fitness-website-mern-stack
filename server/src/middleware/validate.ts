import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { z, ZodType } from 'zod';

/**
 * Generic middleware to validate request body fields using Zod.
 * @param fields - An object mapping field names to Zod schemas.
 * @param options - Additional options for validation
 */
const validate = (
  fields: Record<string, ZodType<any>>,
  options: { allowFiles?: boolean } = {}
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema = z.object(fields);
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw createHttpError(400, `Validation error: ${result.error.message}`);
    }
    req.body = result.data;
    next();
  };
};

export default validate;
