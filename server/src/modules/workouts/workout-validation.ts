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
    .preprocess(
      val => {
        if (Array.isArray(val)) {
          return val.map(exercise => {
            return {
              exercise: z.string().parse(exercise.exercise),
              sets: z.number().parse(parseInt(exercise.sets, 10)),
              reps: z.number().parse(parseInt(exercise.reps, 10))
            };
          });
        }
        return val;
      },
      z.array(
        z.object({
          exercise: z.string(),
          sets: z.number().positive(),
          reps: z.number().positive()
        })
      )
    )
    .optional()
};

const WorkoutValidationSchema = z.object(workoutValidation);

export default WorkoutValidationSchema;
