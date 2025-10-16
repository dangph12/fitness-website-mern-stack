import { model, Schema } from 'mongoose';

import { IHistory } from './history-type';

const HistorySchema = new Schema<IHistory>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workout: { type: Schema.Types.ObjectId, ref: 'Workout', required: true },
    plan: { type: Schema.Types.ObjectId, ref: 'Plan', default: null },
    time: { type: Number, required: true }
  },
  { timestamps: true }
);

const History = model<IHistory>('History', HistorySchema);
export default History;
