import { httpClientExternal } from '@/lib/http';

import { getJikanAnime, getJikanManga } from './jikan';

export const getAllTitles = async () => {
  const response = await httpClientExternal.get(`get-titles`);
  return response.data;
};

export const getTitles = async ({ page = 1 }) => {
  const params = {};

  if (page) {
    params['page'] = page;
  }

  const response = await httpClientExternal.get(`titles`, { params });
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

const jikanAnime = ['tv', 'pelicula', 'ova', 'especial', 'ona', 'music'];
const jikanManga = [
  'manga',
  'manhua',
  'manhwa',
  'novela-ligera',
  'one-shot',
  'doujinshi',
];

export const getTitle = async ({ type, title }) => {
  const response = await httpClientExternal.get(`titles/${type}/${title}`);
  return response;
};

export const getRandomImageByTitle = async ({ title }) => {
  const { data } = await httpClientExternal.get(`random-image-title/${title}`);
  return data;
};
