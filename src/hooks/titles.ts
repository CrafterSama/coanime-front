import httpClient, { httpClientExternal } from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useTitles = ({
  page,
  name,
  sortBy,
  sortDirection,
  perPage,
  typeId,
  ratingId,
  genreId,
  userId,
}: {
  page?: number | string;
  name?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  perPage?: number;
  typeId?: string | number;
  ratingId?: string | number;
  genreId?: string | number;
  userId?: string | number;
}) => {
  const params: Record<string, any> = {};

  if (page) {
    params['page'] = page;
  }

  if (name) {
    params['name'] = name;
  }

  if (sortBy) {
    params['sort_by'] = sortBy;
  }

  if (sortDirection) {
    params['sort_direction'] = sortDirection;
  }

  if (perPage) {
    params['per_page'] = perPage;
  }

  if (typeId) {
    params['type_id'] = typeId;
  }

  if (ratingId) {
    params['rating_id'] = ratingId;
  }

  if (genreId) {
    params['genre_id'] = genreId;
  }

  if (userId) {
    params['user_id'] = userId;
  }

  return useQuery({
    queryKey: [
      'titles',
      page,
      name,
      sortBy,
      sortDirection,
      perPage,
      typeId,
      ratingId,
      genreId,
      userId,
    ],
    queryFn: async () => {
      const paramsWithFilters = { ...params, include_filters: 1 };
      const response = await httpClient.get(`titles`, {
        params: paramsWithFilters,
      });
      return response.data;
    },
  });
};

export const useTitle = ({ id }: { id: string | number }) => {
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

export const useGetUserTitleList = ({ page = 1 }: { page?: number }) => {
  const params: Record<string, any> = {};

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
