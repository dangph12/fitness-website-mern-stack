import { Types } from 'mongoose';

export interface IMeal {
  title: string;
  image: string;
  mealType: string;
  quantity: number;
  userId: Types.ObjectId;
  foods: [Types.ObjectId];
}
