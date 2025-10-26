import * as yup from 'yup';

export const planValidationSchema = yup.object().shape({
  title: yup
    .string()
    .required('Plan title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),

  description: yup
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim(),

  isPublic: yup.boolean().required('Status is required'),

  image: yup
    .mixed()
    .nullable()
    .test('fileSize', 'Image must be less than 10MB', value => {
      if (!value || typeof value === 'string') return true;
      return value.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'Only image files are allowed', value => {
      if (!value || typeof value === 'string') return true;
      return value.type?.startsWith('image/');
    }),

  workouts: yup
    .array()
    .of(
      yup.object().shape({
        _id: yup.string().required(),
        title: yup.string().required(),
        image: yup.string(),
        exercises: yup.array().of(
          yup.object().shape({
            exercise: yup.string().required(),
            exerciseTitle: yup.string(), // ✅ Optional title for display
            sets: yup.array().of(yup.number()).min(1)
          })
        )
      })
    )
    .min(1, 'Please add at least one workout')
    .required('Workouts are required')
});
