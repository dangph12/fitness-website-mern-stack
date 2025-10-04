import { model, Schema } from 'mongoose';

import { IExercise } from './exercise-type';

const ExerciseSchema = new Schema<IExercise>(
  {
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true
    },
    exerciseType: {
      type: String,
      enum: [
        'Strength',
        'Stretching',
        'Power',
        'Olympic',
        'Explosive',
        'Mobility',
        'Dynamic',
        'Yoga'
      ],
      required: true
    },
    tutorialVideo: { type: String, default: '' },
    instructions: { type: String, required: true },
    muscles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Muscle',
        required: true
      }
    ],
    equipments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true
      }
    ]
  },
  { timestamps: true }
);

const Exercise = model<IExercise>('Exercise', ExerciseSchema);
export default Exercise;
