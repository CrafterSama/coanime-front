import * as yup from 'yup';

export const postSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  excerpt: yup.string().required('Excerpt is required'),
  content: yup.string().required('Content is required'),
  image: yup.string().notRequired(),
  category_id: yup.mixed().required('Categories is required'),
  tags: yup.array().notRequired(),
  postponed_to: yup.string().notRequired(),
});
