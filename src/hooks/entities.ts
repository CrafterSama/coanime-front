import httpClient from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useEntities = ({ page = '' }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery({
    queryKey: ['entities', page],
    queryFn: async () => {
      const response = await httpClient.get(`companies`, params);
      return response.data;
    },
  });
};

export const useEntity = ({ slug }) => {
  return useQuery({
    queryKey: ['entity', slug],
    queryFn: async () => {
      const response = await httpClient.get(`companies/${slug}`);
      return response.data;
    },
  });
};
