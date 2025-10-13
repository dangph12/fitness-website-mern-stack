import { z } from 'zod';

const goalValidation = {
  targetWeight: z.number()
};

const GoalValidationSchema = z.object(goalValidation);

export default GoalValidationSchema;
