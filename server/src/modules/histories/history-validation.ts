import { userInfo } from 'os';
import z from 'zod';

const HistoryValidation = {
  user: z.string(),
  workout: z.string(),
  plan: z.string().optional(),
  time: z.number()
};

const HistoryValidationSchema = z.object(HistoryValidation);

export default HistoryValidationSchema;
