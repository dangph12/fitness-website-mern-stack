import { Types } from 'mongoose';

export interface IGoal {
  targetWeight: number;
  user: Types.ObjectId;
  diet:
    | 'Mediterranean'
    | 'Ketogenic (Keto)'
    | 'Paleo'
    | 'Vegetarian'
    | 'Vegan'
    | 'Gluten-Free'
    | 'Low-Carb';
  fitnessGoal: 'Lose Weight' | 'Build Muscle' | 'To be Healthy';
}
