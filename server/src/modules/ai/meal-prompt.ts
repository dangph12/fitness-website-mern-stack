import { IInputGenerateMeal } from './ai-type';

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
           {
             "food": "68de1f47c4bb5bf8343f5d87",  // Bittermelon
             "quantity": 1
           },
           {
             "food": "68de1f41019458184ed0aa5f",  // Lettuce
             "quantity": 1
           },
           {
             "food": "68de1f3c283d884cd362fddb",  // Beetroot
             "quantity": 1
           }
         ]
       }
     
     DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;
};

export default mealPrompt;
