import { model, Schema } from 'mongoose';

import { IWeightRecord } from './weight-record-type';

const WeightRecordSchema = new Schema<IWeightRecord>(
  {
    weight: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const WeightRecord = model<IWeightRecord>('WeightRecord', WeightRecordSchema);
export default WeightRecord;
