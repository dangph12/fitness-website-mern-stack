import { z } from 'zod';

export const LocalLogin = z.object({
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const LocalSignUp = z
  .object({
    email: z.email(),
    name: z.string().min(1, 'Name is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters long')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match"
  });

export const ForgotPassword = z.object({
  email: z.email('Invalid email format')
});

export const ResetPassword = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match"
  });
