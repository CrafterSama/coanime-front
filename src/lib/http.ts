import axios, { AxiosRequestConfig } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

export const HTTP_METHODS = {
  post: 'POST',
  get: 'GET',
  put: 'PUT',
  delete: 'DELETE',
  patch: 'PATCH',
};

const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  return `${url}/api/v1`;
};

const getAuthApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  return `${url}`;
};

const getApiCookieUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  return `${url}/sanctum/csrf-cookie`;
};

const getInstance = (config?: AxiosRequestConfig) => {
  const transformRequest = [].concat(function (data) {
    if (!data) {
      return;
    }

    return snakecaseKeys(data, {
      exclude: ['_destroy'],
    });
  }, axios.defaults.transformRequest);
  const transformResponse = [].concat(axios.defaults.transformResponse, function (data) {
    if (!data) {
      return;
    }

    const { meta, ...rest } = data;

    if (!meta) return camelcaseKeys(rest, { deep: true });

    return { meta, ...camelcaseKeys(rest, { deep: true }) };
  });

  axios.defaults.withCredentials = true;

  return axios.create({
    baseURL: '/',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    transformRequest,
    transformResponse,
    ...config,
  });
};

export const httpClient = getInstance({
  baseURL: getApiUrl(),
});

export const httpClientAuth = getInstance({
  baseURL: getAuthApiUrl(),
});

export const setFormDataHeader = () => {
  httpClient.interceptors.request.use(
    async (config) => {
      config.headers = {
        ...config.headers,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest',
      };

      return config;
    },
    (error: any) => {
      Promise.reject(error);
    },
  );
};

export default httpClient;
