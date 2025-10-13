import { Document, model, Schema } from 'mongoose';

import GoalModel from '../goals/goal-model';
import { IUser } from './user-type';

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, lowercase: true, unique: true, sparse: true },
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    gender: { type: String },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user'
    },
    dob: { type: Date },
    isActive: { type: Boolean, default: true },
    profileCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

UserSchema.post('save', async (doc: IUserDocument, next) => {
  try {
    if (doc.role === 'user') {
      await GoalModel.updateOne(
        { user: doc._id },
        { $setOnInsert: { user: doc._id, targetWeight: 0 } },
        { upsert: true }
      );
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

const User = model<IUser>('User', UserSchema);
export default User;
