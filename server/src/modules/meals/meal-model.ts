import { model, Schema } from 'mongoose';

import { IMeal } from './meal-type';

const MealSchema = new Schema<IMeal>(
  {
    title: { type: String, required: true },
    image: { type: String, default: '' },
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Brunch', 'Dessert'],
      required: true
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    foods: [
      {
        food: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
        quantity: { type: Number, required: true }
      }
    ],
    scheduledAt: { type: Date }
  },
  { timestamps: true }
);

const Meal = model<IMeal>('Meal', MealSchema);
export default Meal;
