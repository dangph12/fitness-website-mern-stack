import { z } from 'zod';

const MealValidationSchema = z.object({
  title: z.string(),
  mealType: z.enum([
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack',
    'Brunch',
    'Dessert'
  ]),
  quantity: z.preprocess(val => {
    if (typeof val === 'string') return parseInt(val, 10);
    return val;
  }, z.number()),
  userId: z.string(),
  foods: z.preprocess(val => {
    if (typeof val === 'string') return val.split(',');
    return val;
  }, z.array(z.string()))
});

export default MealValidationSchema;
