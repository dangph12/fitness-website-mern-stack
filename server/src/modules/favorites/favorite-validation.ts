import { z } from 'zod';

const FavoriteValidation = {
  workouts: z.array(z.string()).min(1, 'At least one workoutId is required')
};

const FavoriteValidationSchema = z.object(FavoriteValidation);

export default FavoriteValidationSchema;
