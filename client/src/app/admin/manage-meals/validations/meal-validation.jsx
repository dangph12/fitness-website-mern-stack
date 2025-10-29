import * as yup from 'yup';

export const mealValidationSchema = yup.object().shape({
  title: yup
    .string()
    .required('Meal title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),

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
    .test('fileSize', 'Image must be less than 10MB', value => {
      if (!value || typeof value === 'string') return true;
      return value.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'Only image files are allowed', value => {
      if (!value || typeof value === 'string') return true;
      return value.type?.startsWith('image/');
    }),

  foods: yup
    .array()
    .of(
      yup.object().shape({
        food: yup.string().required('Food is required'),
        foodName: yup.string(),
        quantity: yup
          .number()
          .required('Quantity is required')
          .positive('Quantity must be positive')
          .integer('Quantity must be an integer')
          .min(1, 'Quantity must be at least 1')
          .max(1000, 'Quantity must not exceed 1000'),
        foodData: yup.object() // Optional field for display
      })
    )
    .min(1, 'Please add at least one food')
    .required('Foods are required')
});
