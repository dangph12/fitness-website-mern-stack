import * as yup from 'yup';

export const workoutValidationSchema = yup.object().shape({
  title: yup
    .string()
    .required('Workout title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),

  isPublic: yup.boolean().required('Status is required'),

  image: yup
    .mixed()
    .nullable()
    .test('fileType', 'Invalid file type', value => {
      if (!value) return true;
      return value instanceof File && value.type.startsWith('image/');
    })
    .test('fileSize', 'File too large (max 10MB)', value => {
      if (!value) return true;
      return value instanceof File && value.size <= 10 * 1024 * 1024;
    }),

  exercises: yup
    .array()
    .of(
      yup.object().shape({
        exercise: yup.string().required('Exercise ID is required'),
        exerciseTitle: yup.string(),
        exerciseImage: yup.string(),
        exerciseDifficulty: yup.string(),
        exerciseType: yup.string(),
        sets: yup
          .array()
          .of(yup.number().positive('Reps must be positive').required())
          .min(1, 'At least one set is required')
      })
    )
    .min(1, 'At least one exercise is required')
    .required('Exercises are required')
});
