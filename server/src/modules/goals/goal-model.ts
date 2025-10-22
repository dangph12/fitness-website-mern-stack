import { model, Schema } from 'mongoose';

import { IGoal } from './goal-type';

const GoalSchema = new Schema<IGoal>(
  {
    targetWeight: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    diet: {
      type: String,
      enum: [
        'Mediterranean',
        'Ketogenic (Keto)',
        'Paleo',
        'Vegetarian',
        'Vegan',
        'Gluten-Free',
        'Low-Carb'
      ],
      required: true
    },
    fitnessGoal: {
      type: String,
      enum: ['Lose Weight', 'Build Muscle', 'To be Healthy'],
      required: true
    }
  },
  { timestamps: true }
);

const Goal = model<IGoal>('Goal', GoalSchema);
export default Goal;
