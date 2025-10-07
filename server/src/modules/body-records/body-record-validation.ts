import { z } from 'zod';

const bodyRecordValidation = {
  height: z.number(),
  weight: z.number(),
  user: z.string()
};

const BodyRecordValidationSchema = z.object(bodyRecordValidation);

export default BodyRecordValidationSchema;
