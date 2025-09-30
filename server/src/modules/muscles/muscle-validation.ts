import { z } from 'zod';

const MuscleValidation = {
  title: z.string()
};

const MuscleValidationSchema = z.object(MuscleValidation);

export default MuscleValidationSchema;
