import { Request, Response } from 'express';
import createHttpError from 'http-errors';

import ApiResponse from '~/types/api-response';

import AIService from './ai-service';
import { IMealGenerationOptions } from './ai-type';

const extractSingleValue = (value?: unknown): unknown => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const coerceNumber = (value?: unknown): number | undefined => {
  const singleValue = extractSingleValue(value);
  if (singleValue === null || singleValue === undefined || singleValue === '') {
    return undefined;
  }
  const num = Number(singleValue);
  return Number.isFinite(num) ? num : undefined;
};

const coerceString = (value?: unknown): string | undefined => {
  const singleValue = extractSingleValue(value);
  if (typeof singleValue !== 'string') return undefined;
  const trimmed = singleValue.trim();
  return trimmed ? trimmed : undefined;
};

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

    const buildOptionInput = (
      primary?: unknown,
      secondary?: unknown
    ): number | undefined => coerceNumber(primary ?? secondary);

    const mealOptions: IMealGenerationOptions = {
      bodyFatPercentage: buildOptionInput(
        req.body?.bodyFatPercentage ?? req.body?.pbf,
        (req.query?.['bodyFatPercentage'] as unknown) ??
          (req.query?.['pbf'] as unknown)
      ),
      skeletalMuscleMass: buildOptionInput(
        req.body?.skeletalMuscleMass ?? req.body?.smm,
        (req.query?.['skeletalMuscleMass'] as unknown) ??
          (req.query?.['smm'] as unknown)
      ),
      ecwRatio: buildOptionInput(
        req.body?.ecwRatio,
        (req.query?.['ecwRatio'] as unknown) ??
          (req.query?.['ecw_ratio'] as unknown)
      ),
      bodyFatMass: buildOptionInput(
        req.body?.bodyFatMass,
        req.query?.['bodyFatMass'] as unknown
      ),
      visceralFatArea: buildOptionInput(
        req.body?.visceralFatArea,
        req.query?.['visceralFatArea'] as unknown
      ),
      startDate:
        coerceString(req.body?.startDate) ??
        coerceString(req.query?.['startDate']),
      endDate:
        coerceString(req.body?.endDate) ?? coerceString(req.query?.['endDate'])
    };

    const mealPlan = await AIService.generateMealByAI(
      query,
      userId,
      mealOptions
    );

    return res
      .status(200)
      .json(ApiResponse.success('Meal generated successfully by AI', mealPlan));
  }
};

export default AIController;
