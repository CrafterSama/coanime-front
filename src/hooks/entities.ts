import httpClient from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useEntities = ({ page = '' }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery(['entities', page], async () => {
    const response = await httpClient.get(`companies`, params);
    return response.data;
  });
};

export const useEntity = ({ slug }) => {
  return useQuery(['entity', slug], async () => {
    const response = await httpClient.get(`companies/${slug}`);
    return response.data;
  });
};
