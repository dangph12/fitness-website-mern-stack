import * as yup from 'yup';

// Schema cho create/edit single meal
export const singleMealValidationSchema = yup.object().shape({
  title: yup
    .string()
    .required('Meal title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),

  mealType: yup
    .string()
    .required('Meal type is required')
    .oneOf(
      ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Brunch', 'Dessert'],
      'Invalid meal type'
    ),

  image: yup
    .mixed()
    .nullable()
    .test('fileSize', 'File size must be less than 10MB', value => {
      if (!value) return true;
      return value.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'Only image files are allowed', value => {
      if (!value) return true;
      return ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(
        value.type
      );
    }),

  foods: yup
    .array()
    .of(
      yup.object().shape({
        food: yup.string().required('Food ID is required'),
        quantity: yup
          .number()
          .required('Quantity is required')
          .positive('Quantity must be positive')
          .integer('Quantity must be an integer')
      })
    )
    .min(1, 'At least one food is required')
});

// Schema cho bulk create (multiple days/meals)
export const mealValidationSchema = yup.object().shape({
  titleBase: yup
    .string()
    .required('Meal title base is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),

  image: yup
    .mixed()
    .nullable()
    .test('fileSize', 'File size must be less than 10MB', value => {
      if (!value) return true;
      return value.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'Only image files are allowed', value => {
      if (!value) return true;
      return ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(
        value.type
      );
    }),

  days: yup
    .array()
    .of(
      yup.object().shape({
        date: yup.date().required(),
        meals: yup.array().of(
          yup.object().shape({
            mealType: yup.string().required(),
            title: yup.string().nullable(),
            foods: yup.array().of(
              yup.object().shape({
                food: yup.string().required('Food ID is required'),
                quantity: yup
                  .number()
                  .required('Quantity is required')
                  .positive('Quantity must be positive')
                  .integer('Quantity must be an integer')
              })
            )
          })
        )
      })
    )
    .min(1, 'At least one day is required')
});
