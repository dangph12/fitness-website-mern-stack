import { z } from 'zod';

const UserValidation = {
  email: z.email(),
  name: z.string(),
  avatar: z.string(),
  gender: z.string().optional(),
  role: z.enum(['user', 'admin']),
  providers: z.array(z.string()),
  isActive: z.boolean().optional()
};

const UserValidationSchema = z.object(UserValidation);

export default UserValidationSchema;
