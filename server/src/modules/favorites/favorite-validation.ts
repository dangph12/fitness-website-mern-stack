import { z } from 'zod';

const FavoriteValidation = {
  user: z.string(),
  workout: z.string()
};

const FavoriteValidationSchema = z.object(FavoriteValidation);

export default FavoriteValidationSchema;
