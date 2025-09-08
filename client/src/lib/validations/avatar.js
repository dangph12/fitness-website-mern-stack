import * as yup from 'yup';

export const avatarSchema = yup.object().shape({
  avatar: yup
    .mixed()
    .test('fileSize', 'File too large (max 5MB)', value => {
      if (!value || !value[0]) return true;
      return value[0].size <= 5000000;
    })
    .test('fileType', 'Unsupported file format', value => {
      if (!value || !value[0]) return true;
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(value[0].type);
    })
});
