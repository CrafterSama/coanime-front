import * as yup from 'yup';
import { setLocale } from 'yup';
import { es } from 'yup-locales';
setLocale(es);

export const personSchema = yup.object().shape({
  name: yup.string().required('El nombre es obligatorio').max(255),
  japaneseName: yup.string().required('El nombre en japonés es obligatorio'),
  areasSkillsHobbies: yup
    .string()
    .required('Las áreas, habilidades y hobbies son obligatorias'),
  about: yup.string().required('La descripción es obligatoria'),
  cityId: yup
    .object()
    .shape({
      value: yup.number().required(),
      label: yup.string().required(),
    })
    .required('La ciudad es obligatoria'),
  birthday: yup.mixed().nullable().notRequired(),
  countryCode: yup
    .object()
    .shape({
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .required('El país es obligatorio'),
  falldown: yup
    .object()
    .shape({
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .required('El campo falldown es obligatorio'),
  falldownDate: yup.mixed().nullable().notRequired(),
  image: yup.string().notRequired().nullable(),
});
