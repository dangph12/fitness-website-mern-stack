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
    quantity: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    foods: [{ type: Schema.Types.ObjectId, ref: 'Food' }]
  },
  { timestamps: true }
);

const Meal = model<IMeal>('Meal', MealSchema);
export default Meal;
