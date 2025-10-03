import { model, Schema } from 'mongoose';

import { IUser } from './user-type';

const UserSchema = new Schema<IUser>(
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
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const User = model<IUser>('User', UserSchema);
export default User;
