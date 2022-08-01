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

export const useProfile = () => {
  return useQuery(['profile'], async () => {
    const response = await httpClient.get(`me`);
    return response.data;
  });
};

export const updateMe = async (params) => await httpClient.put(`me`, params);
