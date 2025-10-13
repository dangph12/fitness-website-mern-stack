import { Types } from 'mongoose';

export interface IPlan {
  title: string;
  image: string;
  isPublic: boolean;
  description: string;
  user: Types.ObjectId;
  workouts: Types.ObjectId[];
}

export interface ICreatePlan {
  title: string;
  image: string;
  isPublic: boolean;
  description: string;
  user: Types.ObjectId;
  workouts: [
    {
      title: string;
      image?: string;
      isPublic?: boolean;
      user: Types.ObjectId;
      exercises: [
        {
          exercise: Types.ObjectId;
          sets: number;
          reps: number;
        }
      ];
    }
  ];
}
