import * as yup from 'yup';

export const profileSchema = yup.object().shape({
  name: yup.string().required('Title is required'),
  sinopsis: yup.string().required('Sinopsis is required'),
  otherTitles: yup.string().notRequired(),
  images: yup.string().required('You must upload an image'),
  justYear: yup.mixed().notRequired(),
  typeId: yup.object().required('Type is required'),
  ratingId: yup.object().required('Rating is required'),
  genreId: yup.array().required('Until a Genre is required'),
  broadTime: yup.string().required('Broadcast Start at is required'),
  broadFinish: yup.string().notRequired().nullable(),
  episodies: yup.mixed().notRequired(),
  status: yup.mixed().notRequired(),
  trailerUrl: yup.string().notRequired().nullable(),
});
