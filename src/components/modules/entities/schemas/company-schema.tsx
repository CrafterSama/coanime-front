import * as yup from 'yup';
import { setLocale } from 'yup';
import { es } from 'yup-locales';

setLocale(es);

export const companySchema = yup.object().shape({
  name: yup.string().required('El nombre es obligatorio').max(255),
  about: yup.string().required('La descripción es obligatoria'),
  countryCode: yup
    .object()
    .shape({
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .required('El país es obligatorio'),
  website: yup.string().required('La web es obligatoria').url('URL inválida'),
  foundationDate: yup.mixed().nullable().notRequired(),
  image: yup.string().notRequired().nullable(),
});
