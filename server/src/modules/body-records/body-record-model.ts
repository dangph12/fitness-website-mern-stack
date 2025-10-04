import { model, Schema } from 'mongoose';

import { IBodyRecord } from './body-record-type';

const BodyRecordSchema = new Schema<IBodyRecord>(
  {
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bodyClassificationId: {
      type: Schema.Types.ObjectId,
      ref: 'BodyClassification',
      required: true
    }
  },
  { timestamps: true }
);

const BodyRecord = model<IBodyRecord>('WeightRecord', BodyRecordSchema);
export default BodyRecord;
