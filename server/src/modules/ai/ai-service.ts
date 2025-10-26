import createHttpError from 'http-errors';
import { Types } from 'mongoose';

import mealPrompt from '~/modules/ai/ai-prompt';
import BodyRecordService from '~/modules/body-records/body-record-service';
import { IBodyRecord } from '~/modules/body-records/body-record-type';
import FoodService from '~/modules/foods/food-service';
import { IFood } from '~/modules/foods/food-type';
import GoalService from '~/modules/goals/goal-service';
import { IGoal } from '~/modules/goals/goal-type';
import { MealType } from '~/modules/meals/meal-type';
import UserService from '~/modules/users/user-service';
import { IUser } from '~/modules/users/user-type';
import { generateByOpenAI } from '~/utils/gemini-ai';

import { IInputGenerateMeal } from './ai-type';

type MealContext = {
  user: IUser;
  goal: IGoal;
  bodyRecord: IBodyRecord;
};

type FoodWithId = IFood & { _id?: unknown };

const DEFAULT_INPUT: IInputGenerateMeal = {
  age: 30,
  height: 170,
  weight: 70,
  targetWeight: 65,
  fitnessGoal: 'Lose weight',
  diet: 'No dairy'
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

const getFoodIdentifier = (food?: FoodWithId): string => {
  if (!food) return '';
  const rawId = (food as { _id?: unknown })?._id;
  if (typeof rawId === 'string') return rawId;
  if (rawId instanceof Types.ObjectId) return rawId.toString();
  return '';
};

const formatFoodCatalog = (foods: FoodWithId[]): string => {
  if (!foods?.length) {
    return 'No foods available. Use SAMPLE_FOOD_ID as needed.';
  }

  return foods
    .map(food => {
      const id = getFoodIdentifier(food) || 'UNKNOWN_ID';
      return `- ${food.title} | id: ${id} | category: ${food.category} | unit: ${food.unit} | calories: ${food.calories} | protein: ${food.protein} | fat: ${food.fat} | carbs: ${food.carbohydrate}`;
    })
    .join('\n');
};

const buildPrompt = (
  input: IInputGenerateMeal,
  foods: FoodWithId[],
  query?: string
): string => {
  const basePrompt = mealPrompt(input);
  const catalog = formatFoodCatalog(foods);
  const sections = [
    basePrompt,
    `Available foods catalog (use these ids in the "food" field):\n${catalog}`
  ];

  if (query?.trim()) {
    sections.push(`User additional request: ${query.trim()}`);
  }

  return sections.join('\n\n');
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

const isQuotaOrRateLimitError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;

  const status =
    typeof (error as { status?: unknown }).status === 'number'
      ? (error as { status?: number }).status
      : typeof (error as { response?: { status?: number } }).response
            ?.status === 'number'
        ? (error as { response?: { status?: number } }).response?.status
        : undefined;

  const code =
    (error as { code?: string }).code ??
    (error as { error?: { code?: string } }).error?.code ??
    (error as { error?: { type?: string } }).error?.type;

  return (
    status === 429 ||
    code === 'insufficient_quota' ||
    code === 'rate_limit_exceeded'
  );
};

const fallbackMealString = async (
  context: MealContext,
  foods: FoodWithId[]
): Promise<string> => {
  const meal = {
    title: `${context.goal.fitnessGoal ?? 'Balanced'} Meal`,
    mealType: MealType.Lunch,
    foods: foods.slice(0, 3).map(food => ({
      food: getFoodIdentifier(food) || 'SAMPLE_FOOD_ID',
      quantity: 1
    }))
  };

  if (!meal.foods.length) {
    meal.foods.push({ food: 'SAMPLE_FOOD_ID', quantity: 1 });
  }

  return JSON.stringify(meal);
};

const AIService = {
  generateMealByAI: async (query: string, userId: string): Promise<string> => {
    const context = await loadMealContext(userId);
    const input = buildMealInput(context);
    const foods = (await FoodService.findAll()) as FoodWithId[];
    const prompt = buildPrompt(input, foods, query);
    console.log(prompt);
    try {
      const mealRaw = await generateByOpenAI(prompt);
      return mealRaw;
    } catch (error) {
      if (isQuotaOrRateLimitError(error)) {
        return fallbackMealString(context, foods);
      }
      throw error;
    }
  }
};

export default AIService;
