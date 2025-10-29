import { z } from 'zod';

export const MealValidationSchema = z.object({
  title: z.string(),
  mealType: z.enum([
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack',
    'Brunch',
    'Dessert'
  ]),
  user: z.string(),
  foods: z.preprocess(
    val => {
      if (Array.isArray(val)) {
        return val.map(food => {
          return {
            food: z.string().parse(food.food),
            quantity: z.number().parse(parseInt(food.quantity, 10))
          };
        });
      }
      return val;
    },
    z.array(
      z.object({
        food: z.string(),
        quantity: z.number().positive()
      })
    )
  ),
  scheduledAt: z.string().optional()
});

export const MultipleMealsValidationSchema = z.object({
  meals: z.array(MealValidationSchema)
});
