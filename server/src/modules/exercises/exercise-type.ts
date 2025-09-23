import { Types } from 'mongoose';

export interface IExercise {
  title: string;
  difficulty: string;
  tutorialVideo: string;
  instructions: string;
  muscles: [Types.ObjectId];
  equipment: [Types.ObjectId];
}
