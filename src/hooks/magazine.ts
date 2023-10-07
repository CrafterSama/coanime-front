import httpClient from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useMagazines = ({ page = '' }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery(['magazines', page], async () => {
    const response = await httpClient.get(`magazine`, params);
    return response.data;
  });
};

export const useMagazine = (slug: string) => {
  return useQuery(['magazine', slug], async () => {
    const response = await httpClient.get(`magazines/${slug}`);
    return response.data;
  });
};
