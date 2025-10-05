import { z } from 'zod';

const ExerciseValidation = {
  title: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  type: z.enum([
    'Strength',
    'Stretching',
    'Power',
    'Olympic',
    'Explosive',
    'Mobility',
    'Dynamic',
    'Yoga'
  ]),
  instructions: z.string(),
  muscles: z.array(z.string()),
  equipments: z.array(z.string())
};

const ExerciseValidationSchema = z.object(ExerciseValidation);

export default ExerciseValidationSchema;
