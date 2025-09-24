import { Types } from 'mongoose';

export interface IWorkout {
  title: string;
  image: string;
  userId: Types.ObjectId;
  planId?: Types.ObjectId;
  exercises: [
    {
      exerciseId: Types.ObjectId;
      sets: number;
      reps: number;
      rest?: number;
    }
  ];
}
