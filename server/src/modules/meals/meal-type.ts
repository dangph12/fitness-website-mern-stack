import { Types } from 'mongoose';

export interface IMeal {
  title: string;
  image: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Brunch' | 'Dessert';
  quantity: number;
  userId: Types.ObjectId;
  foods: [Types.ObjectId];
}
