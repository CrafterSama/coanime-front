import { useQuery } from 'react-query';

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

export const useTitle = (slug: string) => {
  return useQuery(['title', slug], async () => {
    const response = await httpClient.get(`titles/${slug}`);
    return response.data;
  });
};

export const useExternalTitles = ({ page = null }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery(['externalTitles', page], async () => {
    const response = await httpClientExternal.get(`titles`, { params });
    return response.data;
  });
};

export const useExternalTitlesByType = ({ type, page = null }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  return useQuery(['externalTitlesByType', type, page], async () => {
    const response = await httpClientExternal.get(`titles/${type}`, { params });
    return response.data;
  });
};

export const useExternalTitle = ({ type, title }) => {
  return useQuery(['externalTitle', type, title], async () => {
    const response = await httpClientExternal.get(`titles/${type}/${title}`);
    return response.data;
  });
};

export const useSearchTitle = ({ name = 'a' }) => {
  return useQuery(['externalSearchTitle', name], async () => {
    const response = await httpClientExternal.get(`search/titles/${name}`);
    return response.data;
  });
};
