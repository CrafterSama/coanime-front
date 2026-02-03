import httpClient from '@/lib/http';
import { getPeopleFormFilters } from '@/services/people';
import { useQuery } from '@tanstack/react-query';

export const usePeople = ({
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
      'people',
      page,
      name,
      sortBy,
      sortDirection,
      perPage,
      countryCode,
    ],
    queryFn: async () => {
      const paramsWithFilters = { ...params, include_filters: 1 };
      const response = await httpClient.get(`people`, {
        params: paramsWithFilters,
      });
      return response.data;
    },
  });
};

export const usePerson = (slug: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['person', slug],
    queryFn: async () => {
      const response = await httpClient.get(`people/${slug}`);
      return response.data;
    },
    enabled: options?.enabled !== false && !!slug,
  });
};

/** Form filters (countries, cities) for people create/edit */
export const usePeopleFormFilters = () => {
  return useQuery({
    queryKey: ['people-form-filters'],
    queryFn: getPeopleFormFilters,
  });
};
