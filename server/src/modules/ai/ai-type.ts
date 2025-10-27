import { Types } from 'mongoose';

export interface IGenerateMeal {
  title: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Brunch' | 'Dessert';
  scheduledAt: string;
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

export interface IMealGenerationOptions {
  bodyFatPercentage?: number;
  skeletalMuscleMass?: number;
  ecwRatio?: number;
  bodyFatMass?: number;
  visceralFatArea?: number;
  startDate?: string;
  endDate?: string;
}
