import { Types } from 'mongoose';

export interface IMeal {
  title: string;
  image: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Brunch' | 'Dessert';
  user: Types.ObjectId;
  foods: { food: Types.ObjectId; quantity: number }[];
}
