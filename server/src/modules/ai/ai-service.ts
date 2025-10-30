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
import { userMembershipService } from '~/modules/users/user-membership-service';
import UserService from '~/modules/users/user-service';
import { IUser } from '~/modules/users/user-type';
import { generateByOpenAI } from '~/utils/gemini-ai';

import { IInputGenerateMeal, IMealGenerationOptions } from './ai-type';

type MealContext = {
  user: IUser;
  goal: IGoal;
  bodyRecord: IBodyRecord;
};

type FoodWithId = IFood & { _id?: unknown };

const FALLBACK_MEAL_TYPES: MealType[] = [
  MealType.Breakfast,
  MealType.Lunch,
  MealType.Dinner
];

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

const formatScheduledDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const parseDateInput = (value?: string | null): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(0, 0, 0, 0);
  return parsed;
};

const resolveScheduledDates = (options?: IMealGenerationOptions): string[] => {
  const start = parseDateInput(options?.startDate ?? null);
  const end = parseDateInput(options?.endDate ?? null);

  if (!start && !end) {
    return [formatScheduledDate(new Date())];
  }

  let rangeStart = start ?? end!;
  let rangeEnd = end ?? start ?? rangeStart;

  if (rangeEnd < rangeStart) {
    [rangeStart, rangeEnd] = [rangeEnd, rangeStart];
  }

  const dates: string[] = [];
  const cursor = new Date(rangeStart);

  while (cursor <= rangeEnd) {
    dates.push(formatScheduledDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates.length ? dates : [formatScheduledDate(new Date())];
};

const buildMetricsSummary = (
  options?: IMealGenerationOptions
): string | undefined => {
  if (!options) return undefined;

  const entries: string[] = [];
  const pushMetric = (label: string, value?: number, suffix = '') => {
    if (value === null || value === undefined) return;
    entries.push(`       - ${label}: ${value}${suffix}`);
  };

  pushMetric('Body fat percentage (PBF)', options.bodyFatPercentage, '%');
  pushMetric('Skeletal muscle mass (SMM)', options.skeletalMuscleMass, ' kg');
  pushMetric('ECW ratio', options.ecwRatio);
  pushMetric('Body fat mass', options.bodyFatMass, ' kg');
  pushMetric('Visceral fat area', options.visceralFatArea, ' cm^2');

  return entries.length ? entries.join('\n') : undefined;
};

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
  scheduledDates: string[],
  options?: IMealGenerationOptions,
  query?: string
): string => {
  const metricsSummary = buildMetricsSummary(options);
  const basePrompt = mealPrompt(input, {
    scheduledDates,
    metricsSummary
  });
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

type GeneratedMeal = {
  title: string;
  mealType: MealType;
  scheduledAt: string;
  foods: { food: string; quantity: number }[];
};

const fallbackMealPlan = async (
  context: MealContext,
  foods: FoodWithId[],
  scheduledDates: string[]
): Promise<GeneratedMeal[]> => {
  const foodIds = foods.map(food => getFoodIdentifier(food)).filter(Boolean);

  if (!foodIds.length) {
    foodIds.push('SAMPLE_FOOD_ID');
  }

  while (foodIds.length < 3) {
    foodIds.push(foodIds[foodIds.length - 1]);
  }

  const meals: GeneratedMeal[] = scheduledDates.map((date, index) => ({
    title: `${context.goal.fitnessGoal ?? 'Balanced'} Meal ${index + 1}`,
    mealType: FALLBACK_MEAL_TYPES[index % FALLBACK_MEAL_TYPES.length],
    scheduledAt: date,
    foods: foodIds.slice(0, 3).map(foodId => ({
      food: foodId,
      quantity: 1
    }))
  }));

  return meals;
};

const parseMealPlan = (raw: string): GeneratedMeal[] => {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('Gemini meal plan is not an array');
    }
    return parsed as GeneratedMeal[];
  } catch {
    throw createHttpError(502, 'Gemini returned an invalid meal plan payload');
  }
};

const AIService = {
  generateMealByAI: async (
    query: string,
    userId: string,
    options?: IMealGenerationOptions
  ): Promise<GeneratedMeal[]> => {
    const context = await loadMealContext(userId);
    const input = buildMealInput(context);
    const foods = (await FoodService.findAll()) as FoodWithId[];
    const scheduledDates = resolveScheduledDates(options);
    const prompt = buildPrompt(input, foods, scheduledDates, options, query);
    console.log(prompt);

    const tokensRequired = Math.max(1, scheduledDates.length);
    await userMembershipService.consumeAiMealTokens(userId, tokensRequired);

    try {
      const mealRaw = await generateByOpenAI(prompt);
      return parseMealPlan(mealRaw);
    } catch (error) {
      if (isQuotaOrRateLimitError(error)) {
        return fallbackMealPlan(context, foods, scheduledDates);
      }
      throw error;
    }
  }
};

export default AIService;
