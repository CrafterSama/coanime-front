import axios, { AxiosRequestConfig } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import { requireEnv } from './env';

export const HTTP_METHODS = {
  post: 'POST',
  get: 'GET',
  put: 'PUT',
  delete: 'DELETE',
  patch: 'PATCH',
};

const getApiUrl = () => {
  const url = requireEnv('NEXT_PUBLIC_BACKEND_URL');
  return `${url}/internal`;
};

const getApiExternalUrl = () => {
  const url = requireEnv('NEXT_PUBLIC_BACKEND_URL');
  return `${url}/external`;
};

const getAuthApiUrl = () => {
  const url = requireEnv('NEXT_PUBLIC_BACKEND_URL');
  return `${url}`;
};

const getInstance = (config?: AxiosRequestConfig) => {
  const transformRequest = [
    function (data: any): any {
      if (!data) {
        return;
      }

      return snakecaseKeys(data, {
        exclude: ['_destroy'],
      });
    },
    ...(Array.isArray(axios.defaults.transformRequest)
      ? axios.defaults.transformRequest
      : axios.defaults.transformRequest
      ? [axios.defaults.transformRequest]
      : []),
  ];
  const transformResponse = [
    ...(Array.isArray(axios.defaults.transformResponse)
      ? axios.defaults.transformResponse
      : axios.defaults.transformResponse
      ? [axios.defaults.transformResponse]
      : []),
    function (data: any): any {
      if (!data) {
        return;
      }

      const { meta, ...rest } = data;

      if (!meta) return camelcaseKeys(rest, { deep: true });

      return { meta, ...camelcaseKeys(rest, { deep: true }) };
    },
  ];

  axios.defaults.withCredentials = true;

  const instance = axios.create({
    baseURL: '/',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, // Necesario para que las cookies (incluida XSRF-TOKEN) viajen
    transformRequest,
    transformResponse,
    ...config,
  });

  // Interceptor de request: Agregar XSRF-TOKEN a todas las peticiones
  instance.interceptors.request.use(
    (config) => {
      // Solo en el navegador
      if (typeof document !== 'undefined') {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];

        if (token && config.headers) {
          // Laravel Sanctum espera el token en esta cabecera
          config.headers['X-XSRF-TOKEN'] = token;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de errores para manejar Network Errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
        // Log del error para debugging
        if (typeof window !== 'undefined') {
          console.error('[HTTP Client] Network Error:', {
            url: error?.config?.url,
            baseURL: error?.config?.baseURL,
            method: error?.config?.method,
          });
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const httpClient = getInstance({
  baseURL: getApiUrl(),
});

export const httpClientExternal = getInstance({
  baseURL: getApiExternalUrl(),
});

export const httpClientAuth = getInstance({
  baseURL: getAuthApiUrl(),
});

export default httpClient;
