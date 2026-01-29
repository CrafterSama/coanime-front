import * as yup from 'yup';
import { setLocale } from 'yup';
import { es } from 'yup-locales';
setLocale(es);

export const postSchema = yup.object().shape({
  title: yup.string().required('El titulo es rquerido'),
  excerpt: yup.string().required('El extracto es Requerido'),
  content: yup.string().required('El Contenido es requerido'),
  image: yup.string().required('Debes Subir una Imagen'),
  categoryId: yup.object().required('Las Categorias son requeridas'),
  tags: yup.array().notRequired(),
  postponedTo: yup.string().notRequired(),
});
