import { z } from 'zod';

const FoodValidation = {
  title: z.string(),
  unit: z.preprocess(val => {
    if (typeof val === 'string') return parseInt(val, 10);
  }, z.number()),
  protein: z.preprocess(val => {
    if (typeof val === 'string') return parseInt(val, 10);
  }, z.number()),
  fat: z.preprocess(val => {
    if (typeof val === 'string') return parseInt(val, 10);
  }, z.number()),
  carbonhydrate: z.preprocess(val => {
    if (typeof val === 'string') return parseInt(val, 10);
  }, z.number()),
  calories: z.preprocess(val => {
    if (typeof val === 'string') return parseInt(val, 10);
  }, z.number()),
  category: z.enum(['Meat', 'Egg', 'Fruits & Vegetables'])
};

const FoodValidationSchema = z.object(FoodValidation);

export default FoodValidationSchema;
