import { model, Schema } from 'mongoose';

import { IFood } from './food-type';

const FoodSchema = new Schema<IFood>(
  {
    title: { type: String, required: true },
    image: { type: String, default: '' },
    unit: { type: Number, required: true },
    calories: { type: Number, required: true },
    proteins: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    category: {
      type: String,
      enum: ['Meat', 'Egg', 'Fruits & Vegetables'],
      required: true
    }
  },
  { timestamps: true }
);

const Food = model<IFood>('Food', FoodSchema);
export default Food;
