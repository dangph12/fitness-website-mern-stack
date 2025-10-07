import { z } from 'zod';

const goalValidation = {
  user: z.string(),
  targetWeight: z.number()
};

const GoalValidationSchema = z.object(goalValidation);

export default GoalValidationSchema;
