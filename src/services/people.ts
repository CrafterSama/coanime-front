import { httpClientExternal } from '@/lib/http';

export const getPeople = async ({ page = 1 }: { page?: number }) => {
  const params: Record<string, any> = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`people`, { params });
  return response;
};

export const getPeopleByCountry = async ({
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

  const response = await httpClientExternal.get(`people/country/${country}`, {
    params,
  });
  return response;
};

export const getPerson = async ({ slug }: { slug: string }) => {
  const response = await httpClientExternal.get(`people/${slug}`);
  return response;
};
