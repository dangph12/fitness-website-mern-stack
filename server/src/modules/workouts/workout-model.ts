import { model, Schema } from 'mongoose';

import { IWorkout } from './workout-type';

const WorkoutSchema = new Schema<IWorkout>(
  {
    title: { type: String, required: true },
    image: { type: String, default: '' },
    isPublic: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    exercises: [
      {
        exercise: {
          type: Schema.Types.ObjectId,
          ref: 'Exercise',
          required: true
        },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

const Workout = model<IWorkout>('Workout', WorkoutSchema);
export default Workout;
