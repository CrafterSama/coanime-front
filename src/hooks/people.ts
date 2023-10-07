import httpClient from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const usePeople = ({ page = '' }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery(['people', page], async () => {
    const response = await httpClient.get(`people`, params);
    return response.data;
  });
};

export const usePerson = (slug: string) => {
  return useQuery(['person', slug], async () => {
    const response = await httpClient.get(`people/${slug}`);
    return response.data;
  });
};
