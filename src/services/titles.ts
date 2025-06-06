import httpClient, { httpClientExternal } from '@/lib/http';

export const getAllTitles = async () => {
  const response = await httpClientExternal.get(`get-titles`);
  return response.data;
};

export const getTitles = async ({ page }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`titles`, { params });
  return response;
};

export const getUpcomingTitles = async ({ page }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`titles/upcoming`, { params });
  return response;
};

export const getTitlesByType = async ({ type, page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`titles/${type}`, { params });
  return response;
};

export const getTitlesByGenre = async ({ genre, page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`genres/${genre}`, { params });
  return response;
};

/*const jikanAnime = ['tv', 'pelicula', 'ova', 'especial', 'ona', 'music'];
const jikanManga = [
  'manga',
  'manhua',
  'manhwa',
  'novela-ligera',
  'one-shot',
  'doujinshi',
];*/

export const getTitle = async ({ type, title }) => {
  const response = await httpClientExternal.get(`titles/${type}/${title}`);
  return response;
};

export const getRandomImageByTitle = async ({ title }) => {
  const { data } = await httpClientExternal.get(`random-image-title/${title}`);
  return data;
};

export const titleUpdate = async (id: string | string[], params: any) =>
  await httpClient.put(`titles/${id}`, params);

export const titleCreate = async (params: any) =>
  await httpClient.post(`titles`, params);

export const getUserTitleList = async ({ page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`/user/title-list`, {
    params,
  });
  return response;
};
