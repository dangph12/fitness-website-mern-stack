import { model, Schema } from 'mongoose';

import { IBodyRecord } from './body-record-type';

const BodyRecordSchema = new Schema<IBodyRecord>(
  {
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    bmi: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bodyClassification: {
      type: Schema.Types.ObjectId,
      ref: 'BodyClassification',
      required: false
    }
  },
  { timestamps: true }
);

const BodyRecord = model<IBodyRecord>('BodyRecord', BodyRecordSchema);
export default BodyRecord;
