import { z } from 'zod';

import { MealType } from '~/modules/meals/meal-type';

const MealOutputSchema = z.object({
  title: z.string(),
  mealType: z.nativeEnum(MealType),
  foods: z.array(
    z.object({
      food: z.string(),
      quantity: z.number().positive()
    })
  )
});

export default MealOutputSchema;
