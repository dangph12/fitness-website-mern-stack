import { Types } from 'mongoose';

export interface IExercise {
  title: string;
  difficulty: string;
  exerciseType: string;
  tutorialVideo: string;
  instructions: string;
  muscles: [Types.ObjectId];
  equipments: [Types.ObjectId];
}
