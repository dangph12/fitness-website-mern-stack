import { z } from 'zod';

const workoutValidation = {
  title: z.string(),
  image: z.string().optional(),
  isPublic: z.preprocess(val => {
    if (typeof val === 'string') {
      return val.toLowerCase() === 'true';
    } else if (typeof val === 'boolean') {
      return val;
    }
  }, z.boolean()),
  user: z.string(),
  exercises: z
    .array(
      z.object({
        exercise: z.string(),
        sets: z
          .array(
            z
              .union([z.number(), z.string()])
              .transform(val => Number(val))
              .pipe(z.number().positive('Sets must be positive numbers'))
          )
          .min(1, 'At least one set is required')
      })
    )
    .optional()
};

const WorkoutValidationSchema = z.object(workoutValidation);

export default WorkoutValidationSchema;
