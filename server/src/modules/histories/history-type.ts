import { Types } from 'mongoose';

export interface IHistory {
  user: Types.ObjectId;
  workout: Types.ObjectId;
  plan?: Types.ObjectId;
  time: number;
}
