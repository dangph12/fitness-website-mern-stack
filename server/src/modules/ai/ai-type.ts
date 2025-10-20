import { Types } from 'mongoose';

export interface IGenerateMeal {
  title: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Brunch' | 'Dessert';
  foods: { food: Types.ObjectId; quantity: number }[];
}

export interface IInputGenerateMeal {
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  fitnessGoal: string;
  diet: string;
}
