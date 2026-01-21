import { httpClientExternal } from '@/lib/http';

export const getEvents = async ({ page = 1 }: { page?: number }) => {
  const params: Record<string, any> = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`events`, { params });
  return response;
};

export const getEventsByCountry = async ({
  country,
  page = 1,
}: {
  country: string;
  page?: number;
}) => {
  const params: Record<string, any> = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`events/country/${country}`, {
    params,
  });
  return response;
};

export const getEvent = async ({ slug }: { slug: string }) => {
  const response = await httpClientExternal.get(`events/${slug}`);
  return response;
};
