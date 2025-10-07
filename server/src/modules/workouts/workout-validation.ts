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
  plan: z.string().optional(),
  exercises: z
    .preprocess(
      val => {
        if (Array.isArray(val)) {
          return val.map(exercise => {
            return {
              exerciseId: z.string().parse(exercise.exerciseId),
              sets: z.number().parse(parseInt(exercise.sets, 10)),
              reps: z.number().parse(parseInt(exercise.reps, 10)),
              rest: z.number().optional().parse(parseInt(exercise.rest, 10))
            };
          });
        }
        return val;
      },
      z.array(
        z.object({
          exerciseId: z.string(),
          sets: z.number().positive(),
          reps: z.number().positive(),
          rest: z.number().optional()
        })
      )
    )
    .optional()
};

const WorkoutValidationSchema = z.object(workoutValidation);

export default WorkoutValidationSchema;
