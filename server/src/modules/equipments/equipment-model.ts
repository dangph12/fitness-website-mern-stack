import { model, Schema } from 'mongoose';

import { IEquipment } from './equipment-type';

const EquipmentSchema = new Schema<IEquipment>(
  {
    title: { type: String, required: true },
    image: { type: String, default: '' }
  },
  { timestamps: true }
);

const Equipment = model<IEquipment>('Equipment', EquipmentSchema);
export default Equipment;
