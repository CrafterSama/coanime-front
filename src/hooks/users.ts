import { useQuery } from '@tanstack/react-query';

import httpClient, { httpClientExternal } from '@/lib/http';

export const useTitles = ({ page = '' }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery(['titles', page], async () => {
    const response = await httpClient.get(`titles`, { params });
    return response.data;
  });
};

export const useProfile = () => {
  return useQuery(['profile'], async () => {
    const response = await httpClient.get(`me`);
    return response.data;
  });
};

export const useProfileByUser = ({ slug }) => {
  return useQuery(['profile', slug], async () => {
    const response = await httpClientExternal.get(`profile/${slug}`);
    return response.data;
  });
};

export const usePostsByUser = ({ id, page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery(['profile-posts', id, page], async () => {
    const response = await httpClientExternal.get(`profile/${id}/posts`, {
      params,
    });
    return response.data;
  });
};

export const useTitlesByUser = ({ id, page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery(['profile-titles', id, page], async () => {
    const response = await httpClientExternal.get(`profile/${id}/titles`, {
      params,
    });
    return response.data;
  });
};

export const updateMe = async (params) => await httpClient.put(`me`, params);

export const useCheckUserStatistics = ({ user, title }) => {
  return useQuery(['user-statistics', title, user], async () => {
    const response = await httpClientExternal.get(
      `statistics/${title}/${user}`
    );
    return response.data;
  });
};

export const useCheckUserRates = ({ user, title }) => {
  return useQuery(['user-rates', title, user], async () => {
    const response = await httpClientExternal.get(`rates/${title}/${user}`);
    return response.data;
  });
};
