import mealPrompt from '~/modules/ai/meal-prompt';
import { generateByOpenAI } from '~/utils/openai';

import BodyRecordService from '../body-records/body-record-service';
import { IBodyRecord } from '../body-records/body-record-type';
import FoodService from '../foods/food-service';
import { IFood } from '../foods/food-type';
import GoalService from '../goals/goal-service';
import { IGoal } from '../goals/goal-type';
import { IMeal } from '../meals/meal-type';
import UserService from '../users/user-service';
import { IUser } from '../users/user-type';
import { IGenerateMeal, IInputGenerateMeal } from './ai-type';

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
    const mealData = generateByOpenAI(prompt);

    const generatedMeal: IGenerateMeal = JSON.parse(mealData as any);
    if (
      generatedMeal &&
      typeof generatedMeal.title === 'string' &&
      ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Brunch', 'Dessert'].includes(
        generatedMeal.mealType
      ) &&
      Array.isArray(generatedMeal.foods) &&
      generatedMeal.foods.every(
        food =>
          food.food &&
          typeof food.food === 'string' &&
          typeof food.quantity === 'number'
      )
    ) {
      return generatedMeal;
    } else {
      throw new Error('Invalid meal structure');
    }
  }
};
