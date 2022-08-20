import { httpClientExternal } from '@/lib/http';

export const getEvents = async ({ page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`events`, { params });
  return response;
};

export const getEvent = async ({ slug }) => {
  const response = await httpClientExternal.get(`events/${slug}`);
  return response;
};
