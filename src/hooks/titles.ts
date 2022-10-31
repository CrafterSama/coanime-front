import { useQuery } from '@tanstack/react-query';

import httpClient, { httpClientExternal } from '@/lib/http';

export const useTitles = ({ page, name }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  if (name) {
    params['name'] = name;
  }

  return useQuery(['titles', page, name], async () => {
    const response = await httpClient.get(`titles`, { params });
    return response.data;
  });
};

export const useTitle = ({ id }) => {
  return useQuery(['title', id], async () => {
    const response = await httpClient.get(`titles/${id}`);
    return response.data;
  });
};

export const useCreateTitle = () => {
  return useQuery(['createTitle'], async () => {
    const response = await httpClient.get(`titles/create`);
    return response.data;
  });
};

export const useGetTitle = (type: string, title: string) => {
  return useQuery(['title', type, title], async () => {
    const response = await httpClientExternal.get(`titles/${type}/${title}`);
    return response.data;
  });
};

export const useGetUserTitleList = ({ page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery(['user-list', page], async () => {
    const response = await httpClientExternal.get(`/user/title-list`, {
      params,
    });
    return response.data;
  });
};

export const useSearchTitle = ({ name = '' }) => {
  const isLongEnough = name.length >= 2;
  return useQuery(
    ['externalSearchTitle', name],
    async () => {
      const response = await httpClientExternal.get(`search/titles/${name}`);
      return response.data;
    },
    { enabled: isLongEnough }
  );
};
