import { Types } from 'mongoose';

export interface IPlan {
  title: string;
  image: string;
  isPublic: boolean;
  description: string;
  user: Types.ObjectId;
  workouts: Types.ObjectId[];
}
