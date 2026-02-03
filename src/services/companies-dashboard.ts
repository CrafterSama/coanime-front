import httpClient from '@/lib/http';

/** Dashboard: form filters (countries) for create/edit */
export const getCompaniesFormFilters = async () => {
  const { data } = await httpClient.get('companies', {
    params: { include_filters: 1, per_page: 1 },
  });
  return { countries: data?.filters?.countries ?? [] };
};

/** Dashboard: create company. Always JSON; image is URL from upload-images. */
export const companyCreate = async (params: Record<string, any>) => {
  return httpClient.post('companies', params);
};

/** Dashboard: update company by id. Always JSON; image is URL from upload-images. */
export const companyUpdate = async (
  id: string | number,
  params: Record<string, any>
) => {
  return httpClient.put(`companies/${id}`, params);
};
