import httpClient, { httpClientExternal } from '@/lib/http';

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

/** Dashboard: get person by slug (internal API) */
export const getPersonInternal = async (slugOrId: string) => {
  const response = await httpClient.get(`people/${slugOrId}`);
  return response.data;
};

/** Dashboard: form filters (countries, cities) for create/edit. Prefer search endpoints for async select. */
export const getPeopleFormFilters = async () => {
  const response = await httpClient.get('people/form-filters');
  return response.data;
};

/** Dashboard: search countries for async select. q min 3 chars. Returns [{ value, label }]. */
export const searchCountries = async (q: string) => {
  const { data } = await httpClient.get('people/countries-search', {
    params: { q: q.trim(), limit: 20 },
  });
  return (data?.result ?? []) as { value: string; label: string }[];
};

/** Dashboard: search cities for async select. q min 3 chars, country_code required. Returns [{ value, label }]. */
export const searchCities = async (q: string, countryCode: string) => {
  const { data } = await httpClient.get('people/cities-search', {
    params: { q: q.trim(), country_code: countryCode, limit: 20 },
  });
  return (data?.result ?? []) as { value: number; label: string }[];
};

/** Dashboard: create person. Always JSON; image is URL from upload-images. */
export const personCreate = async (params: Record<string, any>) => {
  return httpClient.post('people', params);
};

/** Dashboard: update person by id. Always JSON; image is URL from upload-images. */
export const personUpdate = async (
  id: string | number,
  params: Record<string, any>
) => {
  return httpClient.put(`people/${id}`, params);
};
