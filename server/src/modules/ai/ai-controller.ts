import { Request, Response } from 'express';
import createHttpError from 'http-errors';

import ApiResponse from '~/types/api-response';

import AIService from './ai-service';

const AIController = {
  generateMeal: async (req: Request, res: Response) => {
    const user = req.user as Express.User & { _id?: unknown; id?: string };
    const objectId = (user?._id as { toString?: () => string }) || undefined;

    const fallbackUserId =
      (typeof req.params?.userId === 'string' && req.params.userId) ||
      (typeof req.body?.userId === 'string' && req.body.userId) ||
      (typeof req.query?.userId === 'string' && req.query.userId) ||
      '';

    const userId =
      (typeof objectId?.toString === 'function' && objectId.toString()) ||
      user?.id ||
      fallbackUserId;

    if (!userId) {
      throw createHttpError(401, 'Unauthorized');
    }

    const query =
      typeof req.body?.query === 'string'
        ? req.body.query
        : req.body?.query
          ? String(req.body.query)
          : '';

    const mealPlan = await AIService.generateMealByAI(query, userId);

    return res
      .status(200)
      .json(ApiResponse.success('Meal generated successfully by AI', mealPlan));
  }
};

export default AIController;
