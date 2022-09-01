import * as yup from 'yup';
import { setLocale } from 'yup';
import { es } from 'yup-locales';
setLocale(es);

export const titleSchema = yup.object().shape({
  name: yup.string().required('El Nombre es Requerido'),
  sinopsis: yup.string().required('La Sinopsis es Requerido'),
  otherTitles: yup.string().notRequired(),
  images: yup.string().required('Debes Subir una Imagen'),
  justYear: yup.mixed().notRequired(),
  typeId: yup.object().required('El Tipo es Requerido'),
  ratingId: yup.object().required('el Rating es Requerido'),
  genreId: yup.array().required('Al menos debes seleccionar un Genero'),
  broadTime: yup.string().required('Fecha de Estreno es Requerido'),
  broadFinish: yup.string().notRequired().nullable(),
  episodies: yup.mixed().notRequired(),
  status: yup.mixed().required('El Estado es Requerido'),
  trailerUrl: yup.string().notRequired().nullable(),
});
