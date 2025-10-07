import { z } from 'zod';

const planValidation = {
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  isPublic: z.preprocess(val => {
    if (typeof val === 'string') {
      return val.toLowerCase() === 'true';
    } else if (typeof val === 'boolean') {
      return val;
    }
  }, z.boolean()),
  user: z.string(),
  workouts: z.array(z.string()).optional()
};

const PlanValidationSchema = z.object(planValidation);

export default PlanValidationSchema;
