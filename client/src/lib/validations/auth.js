import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  isRemember: yup.boolean().default(false)
});

export const signUpSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  name: yup.string().min(1, 'Name is required').required('Name is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .min(6, 'Confirm Password must be at least 6 characters long')
    .oneOf([yup.ref('password')], "Passwords don't match")
    .required('Confirm Password is required'),
  avatar: yup
    .mixed()
    .test('fileSize', 'File size too large (max 5MB)', value => {
      if (!value || !value[0]) return true;
      return value[0].size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Only image files are allowed', value => {
      if (!value || !value[0]) return true;
      return value[0].type.startsWith('image/');
    })
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .min(6, 'Confirm Password must be at least 6 characters long')
    .oneOf([yup.ref('password')], "Passwords don't match")
    .required('Confirm Password is required')
});
