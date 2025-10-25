import createHttpError from 'http-errors';
import { Types } from 'mongoose';
import type { z } from 'zod';

import mealPrompt from '~/modules/ai/ai-prompt';
import BodyRecordService from '~/modules/body-records/body-record-service';
import { IBodyRecord } from '~/modules/body-records/body-record-type';
import GoalService from '~/modules/goals/goal-service';
import { IGoal } from '~/modules/goals/goal-type';
import { MealType } from '~/modules/meals/meal-type';
import UserService from '~/modules/users/user-service';
import { IUser } from '~/modules/users/user-type';
import { generateByOpenAI } from '~/utils/openai';

import { IGenerateMeal, IInputGenerateMeal } from './ai-type';
import MealOutputSchema from './ai-validation';

type MealContext = {
  user: IUser;
  goal: IGoal;
  bodyRecord: IBodyRecord;
};

const DEFAULT_INPUT: IInputGenerateMeal = {
  age: 30,
  height: 170,
  weight: 70,
  targetWeight: 65,
  fitnessGoal: 'Lose weight',
  diet: 'No dairy'
};

const MEAL_TYPE_LOOKUP = Object.values(MealType).reduce<
  Record<string, MealType>
>((acc, mt) => {
  acc[String(mt).toLowerCase()] = mt;
  return acc;
}, {});

const extractJsonObject = (raw: unknown): string => {
  const serialized = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const match = serialized.match(/\{[\s\S]*\}/);
  return match ? match[0] : serialized;
};

const normalizeMealType = <T extends { mealType?: string }>(value: T): T => {
  if (value?.mealType) {
    const key = value.mealType.toLowerCase();
    if (MEAL_TYPE_LOOKUP[key]) {
      value.mealType = MEAL_TYPE_LOOKUP[key];
    }
  }
  return value;
};

type MealSchemaOutput = z.infer<typeof MealOutputSchema>;

const parseMealFromAI = (raw: unknown): IGenerateMeal => {
  const jsonText = extractJsonObject(raw);
  let candidate: unknown;

  try {
    candidate = JSON.parse(jsonText);
  } catch {
    throw createHttpError(502, 'AI output is not valid JSON');
  }

  const normalized = normalizeMealType(candidate as { mealType?: string });
  const result = MealOutputSchema.safeParse(normalized);

  if (!result.success) {
    throw createHttpError(
      502,
      `AI validation failed: ${result.error.message ?? 'Unknown schema error'}`
    );
  }

  return toGenerateMeal(result.data);
};

const toGenerateMeal = (meal: MealSchemaOutput): IGenerateMeal => {
  const foods = meal.foods.map(item => {
    if (!Types.ObjectId.isValid(item.food)) {
      throw createHttpError(
        400,
        `Invalid food id received from AI: ${item.food}`
      );
    }
    return {
      food: new Types.ObjectId(item.food),
      quantity: item.quantity
    };
  });

  return { ...meal, foods };
};

const calculateAge = (dob?: string | Date | null): number => {
  if (!dob) return DEFAULT_INPUT.age;
  const date = new Date(dob);
  if (Number.isNaN(date.getTime())) return DEFAULT_INPUT.age;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }
  return age;
};

const buildMealInput = ({
  user,
  goal,
  bodyRecord
}: MealContext): IInputGenerateMeal => ({
  age: calculateAge(user.dob),
  height: bodyRecord.height ?? DEFAULT_INPUT.height,
  weight: bodyRecord.weight ?? DEFAULT_INPUT.weight,
  targetWeight: goal.targetWeight ?? DEFAULT_INPUT.targetWeight,
  fitnessGoal: goal.fitnessGoal ?? DEFAULT_INPUT.fitnessGoal,
  diet: goal.diet ?? DEFAULT_INPUT.diet
});

const buildPrompt = (input: IInputGenerateMeal, query?: string): string => {
  const basePrompt = mealPrompt(input);
  if (!query?.trim()) return basePrompt;
  return `${basePrompt}

User additional request: ${query.trim()}`;
};

const loadMealContext = async (userId: string): Promise<MealContext> => {
  const [user, goal, bodyRecords] = await Promise.all([
    UserService.findById(userId),
    GoalService.findByUser(userId),
    BodyRecordService.findByUser(userId)
  ]);

  if (!user) throw createHttpError(404, 'User not found');
  if (!goal) throw createHttpError(404, 'Goal data is missing');
  const bodyRecord = bodyRecords?.[0];
  if (!bodyRecord) throw createHttpError(404, 'Body record data is missing');

  return { user, goal, bodyRecord };
};

const AIService = {
  generateMealByAI: async (
    query: string,
    userId: string
  ): Promise<IGenerateMeal> => {
    const context = await loadMealContext(userId);
    const input = buildMealInput(context);
    const prompt = buildPrompt(input, query);
    const mealRaw = await generateByOpenAI(prompt);

    return parseMealFromAI(mealRaw);
  }
};

export default AIService;
