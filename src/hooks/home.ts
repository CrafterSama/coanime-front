import { useQuery } from 'react-query';

import { httpClientExternal } from '@/lib/http';
import { getDay } from '@/utils/date';

export const getHomeData = async () => {
  const response = await httpClientExternal.get(`home`);
  return response;
};

export const useMagazine = (slug: string) => {
  return useQuery(['magazine', slug], async () => {
    const response = await httpClientExternal.get(`magazines/${slug}`);
    return response.data;
  });
};

export const getBroadcastToday = async () => {
  let response = await fetch(`https://api.jikan.moe/v4/schedules/${getDay()}`);

  response = await response.json();

  return response;
};
