import { z } from 'zod';

const goalValidation = {
  targetWeight: z.number(),
  diet: z.enum([
    'Mediterranean',
    'Ketogenic (Keto)',
    'Paleo',
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Low-Carb'
  ]),
  fitnessGoal: z.enum(['Lose Weight', 'Build Muscle', 'To be Healthy'])
};

const GoalValidationSchema = z.object(goalValidation);

export default GoalValidationSchema;
