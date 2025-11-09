import { Types } from 'mongoose';

export enum MealType {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snack = 'Snack',
  Brunch = 'Brunch',
  Dessert = 'Dessert'
}

export interface IMeal {
  title: string;
  image?: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Brunch' | 'Dessert';
  user: Types.ObjectId;
  foods: { food: Types.ObjectId; quantity: number }[];
  scheduledAt?: Date;
}

export interface IMultipleMeals {
  meals: Array<{
    title: string;
    image?: string;
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Brunch' | 'Dessert';
    user: Types.ObjectId;
    foods: { food: Types.ObjectId; quantity: number }[];
    scheduledAt?: Date;
  }>;
}

export interface IMultipleMealsUpdate {
  meals: Array<{
    _id: string;
    title: string;
    image?: string;
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Brunch' | 'Dessert';
    user: Types.ObjectId;
    foods: { food: Types.ObjectId; quantity: number }[];
    scheduledAt?: Date;
  }>;
}
