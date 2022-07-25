import { useQuery } from 'react-query';

import httpClient, { httpClientAuth } from '@/lib/http';

export const useTitles = ({ page = '' }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery(['titles', page], async () => {
    const response = await httpClient.get(`titles`, params);
    return response.data;
  });
};

export const useTitle = (slug: string) => {
  return useQuery(['title', slug], async () => {
    const response = await httpClient.get(`titles/${slug}`);
    return response.data;
  });
};
