import { Document, model, Schema } from 'mongoose';

import BodyRecordModel from '../body-records/body-record-model';
import FavoriteModel from '../favorites/favorite-model';
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
    membershipLevel: {
      type: String,
      enum: ['normal', 'vip', 'premium'],
      default: 'normal'
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
        {
          $setOnInsert: {
            user: doc._id,
            targetWeight: 0,
            diet: '',
            fitnessGoal: ''
          }
        },
        { upsert: true }
      );

      await BodyRecordModel.updateOne(
        { user: doc._id },
        {
          $setOnInsert: {
            user: doc._id,
            height: 0,
            weight: 0,
            bmi: 0,
            bodyClassification: null
          }
        },
        { upsert: true }
      );

      await FavoriteModel.updateOne(
        { user: doc._id },
        { $setOnInsert: { user: doc._id, workouts: [] } },
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
