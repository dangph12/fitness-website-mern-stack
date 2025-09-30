import { z } from 'zod';

const MuscleValidation = {
  title: z.string(),
  image: z.string(),
};

const MuscleValidationSchema = z.object(MuscleValidation);

export default MuscleValidationSchema;
