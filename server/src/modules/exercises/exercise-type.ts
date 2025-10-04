import { Types } from 'mongoose';

export interface IExercise {
  title: string;
  type: string;
  difficulty: string;
  tutorial: string;
  instructions: string;
  muscles: [Types.ObjectId];
  equipments: [Types.ObjectId];
}
