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

const createPlanValidation = {
  title: z.string(),
  image: z.string().optional(),
  isPublic: z.preprocess(val => {
    if (typeof val === 'string') {
      return val.toLowerCase() === 'true';
    } else if (typeof val === 'boolean') {
      return val;
    }
  }, z.boolean()),
  description: z.string(),
  user: z.string(),
  workouts: z.array(
    z.object({
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
      exercises: z.array(
        z.object({
          exercise: z.string(),
          sets: z.preprocess(val => {
            if (typeof val === 'string') return parseInt(val, 10);
          }, z.number()),
          reps: z.preprocess(val => {
            if (typeof val === 'string') return parseInt(val, 10);
          }, z.number())
        })
      )
    })
  )
};

export const PlanValidationSchema = z.object(planValidation);
export const CreatePlanValidationSchema = z.object(createPlanValidation);
