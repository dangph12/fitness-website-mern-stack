import { z } from 'zod';

const FoodValidation = {
  title: z.string(),
  image: z.string(),
  calories: z.number(),
  proteins: z.number(),
  carbs: z.number(),
  fats: z.number()
};

const FoodValidationSchema = z.object(FoodValidation);

export default FoodValidationSchema;
