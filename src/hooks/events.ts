import httpClient from '@/lib/http';
import { useQuery } from '@tanstack/react-query';

export const useEvents = ({
  page = 1,
  name = '',
  sortBy,
  sortDirection,
  perPage,
  countryCode,
}: {
  page?: number;
  name?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  perPage?: number;
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

  if (countryCode) {
    params['country_code'] = countryCode;
  }

  return useQuery({
    queryKey: [
      'events',
      page,
      name,
      sortBy,
      sortDirection,
      perPage,
      countryCode,
    ],
    queryFn: async () => {
      const paramsWithFilters = { ...params, include_filters: 1 };
      const response = await httpClient.get(`events`, {
        params: paramsWithFilters,
      });
      return response.data;
    },
  });
};

export const useEvent = (slug: string) => {
  return useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      const response = await httpClient.get(`events/${slug}`);
      return response.data;
    },
  });
};
