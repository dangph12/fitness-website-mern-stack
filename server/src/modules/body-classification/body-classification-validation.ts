import { z } from 'zod';

const BodyClassificationValidation = {
  title: z.string(),
  weightFactor: z.number(),
  description: z.string()
};

const BodyClassificationValidationSchema = z.object(
  BodyClassificationValidation
);

export default BodyClassificationValidationSchema;
