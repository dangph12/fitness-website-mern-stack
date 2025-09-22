import { model, Schema } from 'mongoose';

import { IHistory } from './history-type';

const HistorySchema = new Schema<IHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Ref to the History item (could be Exercise, Meal, Plan, etc.)
    itemId: { type: Schema.Types.ObjectId, required: true }
  },
  { timestamps: true }
);

const History = model<IHistory>('History', HistorySchema);
export default History;
