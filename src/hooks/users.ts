import httpClient, { httpClientExternal } from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useTitles = ({ page = '' }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery({
    queryKey: ['titles', page],
    queryFn: async () => {
      const response = await httpClient.get(`titles`, { params });
      return response.data;
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await httpClient.get(`me`);
      return response.data;
    },
  });
};

export const useProfileByUser = ({ slug }) => {
  return useQuery({
    queryKey: ['profile', slug],
    queryFn: async () => {
      const response = await httpClientExternal.get(`profile/${slug}`);
      return response.data;
    },
  });
};

export const usePostsByUser = ({ id, page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery({
    queryKey: ['profile-posts', id, page],
    queryFn: async () => {
      const response = await httpClientExternal.get(`profile/${id}/posts`, {
        params,
      });
      return response.data;
    },
  });
};

export const useTitlesByUser = ({ id, page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery({
    queryKey: ['profile-titles', id, page],
    queryFn: async () => {
      const response = await httpClientExternal.get(`profile/${id}/titles`, {
        params,
      });
      return response.data;
    },
  });
};

export const updateMe = async (params) => await httpClient.put(`me`, params);

export const useCheckUserStatistics = ({ user, title }) => {
  return useQuery({
    queryKey: ['user-statistics', title, user],
    queryFn: async () => {
      const response = await httpClientExternal.get(
        `statistics/${title}/${user}`
      );
      return response.data;
    },
  });
};

export const useCheckUserRates = ({ user, title }) => {
  return useQuery({
    queryKey: ['user-rates', title, user],
    queryFn: async () => {
      const response = await httpClientExternal.get(`rates/${title}/${user}`);
      return response.data;
    },
  });
};
