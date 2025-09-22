import { model, Schema } from 'mongoose';

import { IExercise } from './exercise-type';

const ExerciseSchema = new Schema<IExercise>(
  {
    title: { type: String, required: true },
    difficulty: { type: String, required: true },
    tutorialVideo: { type: String, default: '' },
    instructions: { type: String, required: true },
    muscles: [{ type: Schema.Types.ObjectId, ref: 'Muscle' }],
    equipment: [{ type: Schema.Types.ObjectId, ref: 'Equipment' }]
  },
  { timestamps: true }
);

const Exercise = model<IExercise>('Exercise', ExerciseSchema);
export default Exercise;
