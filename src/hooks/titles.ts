import httpClient, { httpClientExternal } from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useTitles = ({ page, name }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  if (name) {
    params['name'] = name;
  }

  return useQuery({
    queryKey: ['titles', page, name],
    queryFn: async () => {
      const response = await httpClient.get(`titles`, { params });
      return response.data;
    },
  });
};

export const useTitle = ({ id }) => {
  return useQuery({
    queryKey: ['title', id],
    queryFn: async () => {
      const response = await httpClient.get(`titles/${id}`);
      return response.data;
    },
  });
};

export const useCreateTitle = () => {
  return useQuery({
    queryKey: ['createTitle'],
    queryFn: async () => {
      const response = await httpClient.get(`titles/create`);
      return response.data;
    },
  });
};

export const useGetTitle = (type: string, title: string) => {
  return useQuery({
    queryKey: ['title', type, title],
    queryFn: async () => {
      const response = await httpClientExternal.get(`titles/${type}/${title}`);
      return response.data;
    },
  });
};

export const useGetUserTitleList = ({ page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery({
    queryKey: ['user-list', page],
    queryFn: async () => {
      const response = await httpClientExternal.get(`/user/title-list`, {
        params,
      });
      return response.data;
    },
  });
};

export const useSearchTitle = ({ name = '' }) => {
  const isLongEnough = name.length >= 2;
  return useQuery({
    queryKey: ['externalSearchTitle', name],
    queryFn: async () => {
      const response = await httpClientExternal.get(`search/titles/${name}`);
      return response.data;
    },
    enabled: Boolean(isLongEnough && name),
  });
};
