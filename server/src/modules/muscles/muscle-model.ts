import { model, Schema } from 'mongoose';

import { IMuscle } from './muscle-type';

const MuscleSchema = new Schema<IMuscle>(
  {
    title: { type: String, required: true },
    image: { type: String, default: '' }
  },
  { timestamps: true }
);

const Muscle = model<IMuscle>('Muscle', MuscleSchema);
export default Muscle;
