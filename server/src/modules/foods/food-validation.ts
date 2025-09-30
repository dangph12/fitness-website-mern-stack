import { z } from 'zod';

const FoodValidation = {
  title: z.string(),
  image: z.string(),
  unit: z.number(),
  calories: z.number(),
  proteins: z.number(),
  carbs: z.number(),
  fats: z.number(),
  category: z.enum(['Meat', 'Egg', 'Fruits & Vegetables'])
};

const FoodValidationSchema = z.object(FoodValidation);

export default FoodValidationSchema;
