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
      if (!(value instanceof File)) return true;
      return value.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'Only image files are allowed', value => {
      if (!value || typeof value === 'string') return true;
      if (!(value instanceof File)) return true;
      return value.type?.startsWith('image/');
    }),

  days: yup
    .array()
    .of(
      yup.object().shape({
        dayName: yup.string().required('Day name is required'),
        workouts: yup.array().of(
          yup.object().shape({
            title: yup.string().required('Workout title is required'),
            image: yup
              .mixed()
              .nullable()
              .test(
                'fileSize',
                'Workout image must be less than 5MB',
                value => {
                  if (!value) return true;
                  if (typeof value === 'string') return true;
                  if (!(value instanceof File)) return true;
                  return value.size <= 5 * 1024 * 1024;
                }
              )
              .test(
                'fileType',
                'Only image files are allowed for workout',
                value => {
                  if (!value) return true;
                  if (typeof value === 'string') return true;
                  if (!(value instanceof File)) return true;
                  return value.type?.startsWith('image/');
                }
              ),
            exercises: yup.array().of(
              yup.object().shape({
                exercise: yup.mixed().required('Exercise is required'),
                sets: yup
                  .array()
                  .of(yup.number().min(1, 'Reps must be at least 1'))
                  .min(1, 'At least one set is required')
                  .required('Sets are required')
              })
            )
          })
        )
      })
    )
    .min(1, 'Please add at least one day')
    .test('hasWorkouts', 'Please add at least one workout', days => {
      if (!days || days.length === 0) return false;
      return days.some(day => day.workouts && day.workouts.length > 0);
    })
    .test('hasExercises', 'Please add at least one exercise', days => {
      if (!days || days.length === 0) return false;
      return days.some(day =>
        day.workouts?.some(w => w.exercises && w.exercises.length > 0)
      );
    })
    .required('Days are required')
});
