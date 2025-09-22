import { model, Schema } from 'mongoose';

import { IWorkout } from './workout-type';

const WorkoutSchema = new Schema<IWorkout>({}, { timestamps: true });

const Workout = model<IWorkout>('Workout', WorkoutSchema);
export default Workout;
