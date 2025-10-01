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
  userId: z.string(),
  foods: z.preprocess(
    val => {
      if (Array.isArray(val)) {
        return val.map(food => {
          return {
            foodId: z.string().parse(food.foodId),
            quantity: z.number().parse(parseInt(food.quantity, 10))
          };
        });
      }
      return val;
    },
    z.array(
      z.object({
        foodId: z.string(),
        quantity: z.number().positive()
      })
    )
  )
});

export default MealValidationSchema;
