import { MealType } from '../meals/meal-type';
import { IInputGenerateMeal } from './ai-type';

const MEAL_TYPES = Object.values(MealType);
const MEAL_TYPES_LIST = MEAL_TYPES.map(v => `"${v}"`).join(', ');

type MealPromptConfig = {
  scheduledDates: string[];
  metricsSummary?: string;
};

const formatScheduledDates = (dates: string[]): string =>
  dates.map((date, index) => `       ${index + 1}. ${date}`).join('\n');

const mealPrompt = (
  { age, height, weight, targetWeight, fitnessGoal, diet }: IInputGenerateMeal,
  { scheduledDates, metricsSummary }: MealPromptConfig
) => {
  const mealCount = Math.max(1, scheduledDates.length);
  const scheduledDatesBlock = formatScheduledDates(scheduledDates);
  const metricsBlock = metricsSummary
    ? `     
     Additional biometrics to consider:
${metricsSummary}
`
    : '';

  return `You are an experienced nutrition coach creating a personalized diet plan based on:
     Age: ${age}
     Height: ${height}
     Weight: ${weight}
     Target weight: ${targetWeight}
     Fitness goal: ${fitnessGoal}
     Dietary restrictions: ${diet}
${metricsBlock}
     As a professional nutrition coach:
     - Calculate appropriate daily calorie intake based on the person's stats and goals
     - Create a balanced meal plan with proper macronutrient distribution
     - Include a variety of nutrient-dense foods while respecting dietary restrictions
     - "mealType" MUST be EXACTLY one of: ${MEAL_TYPES_LIST}
     - ONLY choose foods from the catalog provided below and reference them by their exact "id" values
     - Generate exactly ${mealCount} meal object${mealCount > 1 ? 's' : ''} in a JSON array, one per scheduled date listed below and in the same order
     - Scheduled dates (use each date for the corresponding meal's "scheduledAt" field):
${scheduledDatesBlock}
     - Each meal must contain between 3 and 6 foods, no more and no less
     - Keep each food quantity realistic: use small positive integers (1-5, no decimals) instead of large numbers like 100 or 200
     - The ONLY allowed top-level fields are "title", "mealType", "scheduledAt", and "foods". Do NOT output "dailyCalories", "macros", "notes", or any other field
     - Consider meal timing around workouts for optimal performance and recovery
     
     CRITICAL SCHEMA INSTRUCTIONS:
     - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
     - DO NOT add fields like "supplements", "macros", "notes", or ANYTHING else
     - ONLY include the EXACT fields shown in the example below
     - Each meal should include ONLY a "title", "mealType", "scheduledAt", and "foods" array

     Return a JSON array with this EXACT structure and no other fields:
       [
         {
           "title": "Healthy Breakfast",
           "mealType": "Breakfast",
           "scheduledAt": "10/27/2025",
           "foods": [
             { "food": "68de1eca0ac8cfd1a7f68780", "quantity": 1 },
             { "food": "68de1ed3dbaa958a9167055a", "quantity": 2 },
             { "food": "68de1eda2c206ba06b417b9f", "quantity": 3 }
           ]
         }
       ]
     
     DO NOT add any fields that are not in this example. Your response must be a valid JSON array with no additional text.`;
};

export default mealPrompt;
