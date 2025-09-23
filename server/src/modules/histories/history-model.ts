import { model, Schema } from 'mongoose';

import { IHistory } from './history-type';

const HistorySchema = new Schema<IHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workoutId: { type: Schema.Types.ObjectId, ref: 'Workout', required: true }
  },
  { timestamps: true }
);

const History = model<IHistory>('History', HistorySchema);
export default History;
