import { Types } from 'mongoose';

export interface IWorkout {
  title: string;
  image: string;
  exercises: [
    {
      exerciseId: Types.ObjectId;
      sets: number;
      reps: number;
      rest?: number;
    }
  ];
}
