import * as yup from 'yup';

export const profileSchema = yup.object().shape({
  name: yup.string().required('Title is required'),
});
