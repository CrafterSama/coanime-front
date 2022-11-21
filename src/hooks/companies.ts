import httpClient, { httpClientAuth } from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useCompanies = ({ page = '' }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery(['companies', page], async () => {
    const response = await httpClient.get(`companies`, params);
    return response.data;
  });
};

export const useCompany = (id: string | number) => {
  return useQuery(['company', id], async () => {
    const response = await httpClient.get(`companies/${id}`);
    return response.data;
  });
};
