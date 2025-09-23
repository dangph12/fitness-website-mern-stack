import { Types } from 'mongoose';

export interface IPlan {
  title: string;
  image: string;
  isPublic: boolean;
  description: string;
  userId: Types.ObjectId;
  workouts: Types.ObjectId[];
}
