import { MealType } from '../meals/meal-type';
import { IInputGenerateMeal } from './ai-type';

const MEAL_TYPES = Object.values(MealType);
const MEAL_TYPES_LIST = MEAL_TYPES.map(v => `"${v}"`).join(', ');

const mealPrompt = ({
  age,
  height,
  weight,
  targetWeight,
  fitnessGoal,
  diet
}: IInputGenerateMeal) => {
  return `You are an experienced nutrition coach creating a personalized diet plan based on:
     Age: ${age}
     Height: ${height}
     Weight: ${weight}
     Fitness goal: ${fitnessGoal}
     Dietary restrictions: ${diet}
     
     As a professional nutrition coach:
     - Calculate appropriate daily calorie intake based on the person's stats and goals
     - Create a balanced meal plan with proper macronutrient distribution
     - Include a variety of nutrient-dense foods while respecting dietary restrictions
     - "mealType" MUST be EXACTLY one of: ${MEAL_TYPES_LIST}
     - Consider meal timing around workouts for optimal performance and recovery
     
     CRITICAL SCHEMA INSTRUCTIONS:
     - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
     - "dailyCalories" MUST be a NUMBER, not a string
     - DO NOT add fields like "supplements", "macros", "notes", or ANYTHING else
     - ONLY include the EXACT fields shown in the example below
     - Each meal should include ONLY a "name" and "foods" array

     Return a JSON object with this EXACT structure and no other fields:
       {
         "title": "Healthy Breakfast",
         "mealType": "Breakfast",
         "foods": [
           { "food": "68de1eca0ac8cfd1a7f68780", "quantity": 1 },
           { "food": "68de1ed3dbaa958a9167055a", "quantity": 2 },
           { "food": "68de1eda2c206ba06b417b9f", "quantity": 3 }
         ]
       }
     
     DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;
};

export default mealPrompt;
