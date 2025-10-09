import { Types } from 'mongoose';

export interface IWorkout {
  title: string;
  image: string;
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
