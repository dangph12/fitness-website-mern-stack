import { z } from 'zod';

const UserValidation = {
  email: z.email(),
  name: z.string(),
  gender: z.string(),
  dob: z.preprocess(val => {
    if (typeof val === 'string' || val instanceof Date) return new Date(val);
  }, z.date()),
  role: z.enum(['user', 'admin']),
  isActive: z.preprocess(val => {
    if (typeof val === 'string') {
      return val.toLowerCase() === 'true';
    } else if (typeof val === 'boolean') {
      return val;
    }
  }, z.boolean())
};

const UserValidationSchema = z.object(UserValidation);

export default UserValidationSchema;
