import { httpClientExternal } from '@/lib/http';

export const getPeople = async ({ page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`people`, { params });
  return response;
};

export const getPeopleByCountry = async ({ country, page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`people/country/${country}`, {
    params,
  });
  return response;
};

export const getPerson = async ({ slug }) => {
  const response = await httpClientExternal.get(`people/${slug}`);
  return response;
};
