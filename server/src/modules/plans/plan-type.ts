import { Types } from 'mongoose';

export interface IPlan {
  title: string;
  image: string;
  isPublic: boolean;
  description: string;
  userId: Types.ObjectId;
  days: [
    {
      exercises: [
        {
          exerciseId: Types.ObjectId;
          sets: number;
          reps: number;
          rest?: number;
        }
      ];
    }
  ];
}
