import { httpClientExternal } from '@/lib/http';

export const getEntities = async ({ page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`companies`, { params });
  return response;
};

export const getEntitiesByCountry = async ({ country, page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(
    `companies/country/${country}`,
    { params }
  );
  return response;
};

export const getEntity = async ({ slug }) => {
  const response = await httpClientExternal.get(`companies/${slug}`);
  return response;
};
