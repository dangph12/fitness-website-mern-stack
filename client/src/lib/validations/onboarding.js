import * as yup from 'yup';

export const onboardingSchema = yup.object().shape({
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender')
    .required('Gender is required'),
  dob: yup
    .date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .min(new Date(1900, 0, 1), 'Please enter a valid date of birth')
    .required('Date of birth is required')
    .test('age', 'You must be at least 13 years old', value => {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= 13;
      }
      return age >= 13;
    }),
  height: yup
    .number()
    .positive('Height must be positive')
    .min(50, 'Height must be at least 50 cm')
    .max(300, 'Height must be less than 300 cm')
    .required('Height is required'),
  weight: yup
    .number()
    .positive('Weight must be positive')
    .min(20, 'Weight must be at least 20 kg')
    .max(500, 'Weight must be less than 500 kg')
    .required('Weight is required')
});
