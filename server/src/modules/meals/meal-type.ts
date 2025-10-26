import { Types } from 'mongoose';

export interface IMeal {
  title: string;
  image: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Brunch' | 'Dessert';
  quantity: number;
  user: Types.ObjectId;
  foods: { food: Types.ObjectId; quantity: number }[];
  scheduleAt: Date;
}
