import httpClient from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useMagazines = ({
  page = 1,
  name = '',
  sortBy,
  sortDirection,
  perPage,
  typeId,
  releaseId,
  countryCode,
}: {
  page?: number;
  name?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  perPage?: number;
  typeId?: string | number;
  releaseId?: string | number;
  countryCode?: string;
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

  if (releaseId) {
    params['release_id'] = releaseId;
  }

  if (countryCode) {
    params['country_code'] = countryCode;
  }

  return useQuery({
    queryKey: [
      'magazines',
      page,
      name,
      sortBy,
      sortDirection,
      perPage,
      typeId,
      releaseId,
      countryCode,
    ],
    queryFn: async () => {
      const paramsWithFilters = { ...params, include_filters: 1 };
      const response = await httpClient.get(`magazine`, {
        params: paramsWithFilters,
      });
      return response.data;
    },
  });
};

export const useMagazine = (slug: string) => {
  return useQuery({
    queryKey: ['magazine', slug],
    queryFn: async () => {
      const response = await httpClient.get(`magazines/${slug}`);
      return response.data;
    },
  });
};
