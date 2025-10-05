import { z } from 'zod';

const BodyClassificationValidation = {
  title: z.string(),
  weightFactor: z.object({
    min: z.number(),
    max: z.number()
  }),
  description: z.string()
};

const BodyClassificationValidationSchema = z.object(
  BodyClassificationValidation
);

export default BodyClassificationValidationSchema;
