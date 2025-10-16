import z from 'zod';

const HistoryValidation = {
  workout: z.string(),
  plan: z.string().optional(),
  time: z.number()
};

const HistoryValidationSchema = z.object(HistoryValidation);

export default HistoryValidationSchema;
