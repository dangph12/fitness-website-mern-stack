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

export const OnboardingValidation = z.object({
  dob: z.preprocess(val => {
    if (!val) return val;
    if (val instanceof Date) return val;
    if (typeof val === 'string') {
      const date = new Date(val);
      return isNaN(date.getTime()) ? val : date;
    }
    return val;
  }, z.date()),
  gender: z.enum(['male', 'female', 'other']),
  height: z.number().positive().min(50).max(300), // in cm
  weight: z.number().positive().min(20).max(500), // in kg
  bmi: z.number().positive().min(10).max(100)
});

export default UserValidationSchema;
