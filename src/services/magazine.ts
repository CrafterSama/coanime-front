import { httpClientExternal } from '@/lib/http';

export const getMagazines = async ({ page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`magazine`, { params });
  return response;
};

export const getMagazine = async ({ slug }) => {
  const response = await httpClientExternal.get(`magazine/${slug}`);
  return response;
};
