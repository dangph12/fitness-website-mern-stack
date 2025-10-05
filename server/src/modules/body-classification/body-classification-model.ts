import { model, Schema } from 'mongoose';

import { IBodyClassification } from './body-classification-type';

const BodyClassificationSchema = new Schema<IBodyClassification>(
  {
    title: { type: String, required: true },
    weightFactor: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

const BodyClassification = model<IBodyClassification>(
  'BodyClassification',
  BodyClassificationSchema
);
export default BodyClassification;
