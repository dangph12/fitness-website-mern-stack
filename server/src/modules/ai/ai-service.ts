import createHttpError from 'http-errors';

import mealPrompt from '~/modules/ai/ai-prompt';
import BodyRecordService from '~/modules/body-records/body-record-service';
import { IBodyRecord } from '~/modules/body-records/body-record-type';
import FoodService from '~/modules/foods/food-service';
import { IFood } from '~/modules/foods/food-type';
import GoalService from '~/modules/goals/goal-service';
import { IGoal } from '~/modules/goals/goal-type';
import { IMeal, MealType } from '~/modules/meals/meal-type';
import UserService from '~/modules/users/user-service';
import { IUser } from '~/modules/users/user-type';
import { generateByOpenAI } from '~/utils/openai';

import { IGenerateMeal, IInputGenerateMeal } from './ai-type';
import MealOutputSchema from './ai-validation';

const extractJson = (raw: unknown): string => {
  const s = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const match = s.match(/\{[\s\S]*\}/);
  if (match) return match[0];
  return s;
};

const normalizeMealType = (v: any): any => {
  try {
    if (
      v &&
      typeof v === 'object' &&
      'mealType' in v &&
      typeof v.mealType === 'string'
    ) {
      const map = Object.values(MealType).reduce<Record<string, MealType>>(
        (acc, mt) => {
          acc[String(mt).toLowerCase()] = mt;
          return acc;
        },
        {}
      );
      const key = v.mealType.toLowerCase();
      if (map[key]) v.mealType = map[key];
    }
  } catch {
    throw createHttpError(400, 'Invalid Object');
  }
  return v;
};

const AIService = {
  generateMealByAI: async (query: string, userId: string) => {
    const user: IUser = await UserService.findById(userId);
    const goal: IGoal = await GoalService.findByUser(userId);
    const bodyRecordData = await BodyRecordService.findByUser(userId);
    const bodyRecord: IBodyRecord = bodyRecordData[0];

    const foodDataResponse = await FoodService.find({ page: 1, limit: 50 });
    const food: IFood[] = foodDataResponse.foods;

    if (!user || !bodyRecord || !goal) {
      throw new Error('User, BodyRecord, or Goal data is missing.');
    }

    const input: IInputGenerateMeal = {
      age: user.dob
        ? new Date().getFullYear() - new Date(user.dob).getFullYear()
        : 30,
      height: bodyRecord.height || 170,
      weight: bodyRecord.weight || 70,
      targetWeight: goal.targetWeight || 65,
      fitnessGoal: goal.fitnessGoal || 'Lose weight',
      diet: goal.diet || 'No dairy'
    };

    const prompt = mealPrompt(input);
    const mealRaw = await generateByOpenAI(prompt);

    const jsonText = extractJson(mealRaw);
    let candidate: unknown;
    try {
      candidate = JSON.parse(jsonText);
    } catch (e) {
      throw new Error('AI output is not valid JSON');
    }

    candidate = normalizeMealType(candidate);

    const result = MealOutputSchema.safeParse(candidate);
    if (!result.success) {
      throw new Error(`AI validation failed: ${result.error.message}`);
    }

    return result.data;
  }
};
