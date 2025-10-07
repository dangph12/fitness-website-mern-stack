import { Types } from 'mongoose';

export interface IWorkout {
  title: string;
  image: string;
  isPublic?: boolean;
  user: Types.ObjectId;
  plan?: Types.ObjectId;
  exercises: [
    {
      exerciseId: Types.ObjectId;
      sets: number;
      reps: number;
      rest?: number;
    }
  ];
}
