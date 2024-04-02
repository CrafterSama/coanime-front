import httpClient from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useCompanies = ({ page = '' }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery({
    queryKey: ['companies', page],
    queryFn: async () => {
      const response = await httpClient.get(`companies`, params);
      return response.data;
    },
  });
};

export const useCompany = (id: string | number) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const response = await httpClient.get(`companies/${id}`);
      return response.data;
    },
  });
};
