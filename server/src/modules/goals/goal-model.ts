import { model, Schema } from 'mongoose';

import { IGoal } from './goal-type';

const GoalSchema = new Schema<IGoal>(
  {
    targetWeight: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const Goal = model<IGoal>('Goal', GoalSchema);
export default Goal;
