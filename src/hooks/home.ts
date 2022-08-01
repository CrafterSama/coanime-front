import { useQuery } from 'react-query';

import { httpClientExternal } from '@/lib/http';

export const useHome = () => {
  return useQuery(['home'], async () => {
    const response = await httpClientExternal.get(`home`);
    return response.data;
  });
};

export const useMagazine = (slug: string) => {
  return useQuery(['magazine', slug], async () => {
    const response = await httpClientExternal.get(`magazines/${slug}`);
    return response.data;
  });
};
