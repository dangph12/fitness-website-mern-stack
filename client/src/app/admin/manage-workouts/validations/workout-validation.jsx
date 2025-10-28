import * as yup from 'yup';

export const workoutValidationSchema = yup.object().shape({
  title: yup
    .string()
    .required('Workout title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),

  isPublic: yup.boolean().required('Status is required'),

  image: yup
    .mixed()
    .nullable()
    .test('fileSize', 'Image must be less than 10MB', value => {
      if (!value || typeof value === 'string') return true;
      if (!(value instanceof File)) return true;
      return value.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'Only image files are allowed', value => {
      if (!value || typeof value === 'string') return true;
      if (!(value instanceof File)) return true;
      return value.type?.startsWith('image/');
    }),

  exercises: yup
    .array()
    .of(
      yup.object().shape({
        exercise: yup.mixed().required('Exercise is required'),
        sets: yup
          .array()
          .of(yup.number().min(1, 'Reps must be at least 1').required())
          .min(1, 'At least one set is required')
      })
    )
    .min(1, 'Please add at least one exercise')
    .required('Exercises are required')
});
