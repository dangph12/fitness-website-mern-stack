import { model, Schema } from 'mongoose';

import { IPlan } from './plan-type';

const PlanSchema = new Schema<IPlan>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    isPublic: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    days: [
      {
        exercises: [
          {
            exerciseId: {
              type: Schema.Types.ObjectId,
              ref: 'Exercise',
              required: true
            },
            sets: { type: Number, required: true },
            reps: { type: Number, required: true },
            rest: { type: Number }
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

const Plan = model<IPlan>('Plan', PlanSchema);
export default Plan;
