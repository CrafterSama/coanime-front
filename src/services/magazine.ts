import { httpClientExternal } from '@/lib/http';

export const getMagazines = async ({ page = 1 }: { page?: number }) => {
  const params: Record<string, any> = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`/magazine`, { params });
  return response;
};

export const getMagazine = async ({ slug }: { slug: string }) => {
  const response = await httpClientExternal.get(`/magazine/${slug}`);
  return response;
};

export const getMagazinesByDemography = async ({
  demography,
  page = 1,
}: {
  demography: string;
  page?: number;
}) => {
  const params: Record<string, any> = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(
    `magazine/demography/${demography}`,
    { params }
  );
  return response;
};
