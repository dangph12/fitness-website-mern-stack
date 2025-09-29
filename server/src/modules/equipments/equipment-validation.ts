import { z } from 'zod';

const EquipmentValidation = {
  title: z.string(),
  image: z.string()
};

const EquipmentValidationSchema = z.object(EquipmentValidation);

export default EquipmentValidationSchema;
