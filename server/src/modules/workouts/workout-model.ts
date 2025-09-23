import { model, Schema } from 'mongoose';

import { IWorkout } from './workout-type';

const WorkoutSchema = new Schema<IWorkout>(
  {
    title: { type: String, required: true },
    image: { type: String, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
    exercises: [
      {
        exerciseId: {
          type: Schema.Types.ObjectId,
          ref: 'Exercise',
          required: true
        },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        rest: { type: Number, default: 60 }
      }
    ]
  },
  { timestamps: true }
);

const Workout = model<IWorkout>('Workout', WorkoutSchema);
export default Workout;
