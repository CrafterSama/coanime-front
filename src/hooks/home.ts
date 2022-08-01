import { useQuery } from 'react-query';

import { httpClientExternal } from '@/lib/http';
import { getDay } from '@/utils/date';

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

export const useBroadcastToday = () => {
  return useQuery(['broadcastToday'], async () => {
    let response = await fetch(
      `https://api.jikan.moe/v4/schedules/${getDay()}`
    );

    response = await response.json();

    return response?.data.filter((item) => item.approved === true);
  });
};
