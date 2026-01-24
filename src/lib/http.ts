import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import { signOut } from 'next-auth/react';

import { LOGIN_ROUTE } from '@/constants/common';
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

  const instance = axios.create({
    baseURL: '/',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    // Eliminar withCredentials - ya no necesario con JWT
    transformRequest,
    transformResponse,
    ...config,
  });

  // Interceptor de request: Agregar JWT token a todas las peticiones
  instance.interceptors.request.use(
    async (config) => {
      // Solo en el navegador
      if (typeof window !== 'undefined' && config.headers) {
        try {
          // Obtener el token JWT de la sesión de NextAuth v4
          const { getSession } = await import('next-auth/react');
          const session = await getSession();

          // TypeScript: accessToken está definido en src/types/next-auth.d.ts
          // Usar type assertion porque TypeScript no reconoce la extensión del tipo
          const accessToken = (session as any)?.accessToken as
            | string
            | undefined;
          if (accessToken) {
            // Agregar el token JWT en el header Authorization
            config.headers['Authorization'] = `Bearer ${accessToken}`;
          }
        } catch (error) {
          // Si hay error obteniendo la sesión, continuar sin token
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.warn('[HTTP Client] No se pudo obtener token JWT:', error);
          }
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de errores para manejar Network Errors y 401
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // Handle 401 Unauthorized: automatically logout and redirect to login
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        const currentPath = window.location.pathname;

        // Avoid infinite loop if already on login page
        if (currentPath !== LOGIN_ROUTE) {
          // Save the current URL (pathname + search) to redirect after login
          const currentUrl = window.location.pathname + window.location.search;

          if (process.env.NODE_ENV === 'development') {
            console.log(
              '[HTTP Client] 401 detected, saving URL and logging out:',
              {
                currentUrl,
                requestUrl: error.config?.url,
                method: error.config?.method,
              }
            );
          }

          // Store the URL in sessionStorage to redirect after login
          // Use sessionStorage instead of localStorage so it's cleared when browser closes
          sessionStorage.setItem('redirectAfterLogin', currentUrl);

          // Clear any existing session data
          try {
            // Clear NextAuth session
            await signOut({
              redirect: false, // We'll handle redirect manually
            });

            if (process.env.NODE_ENV === 'development') {
              console.log('[HTTP Client] SignOut completed');
            }
          } catch (signOutError) {
            // If signOut fails, continue anyway
            console.error('[HTTP Client] Error during signOut:', signOutError);
          }

          // Redirect to login with the redirect parameter
          const loginUrl = `${LOGIN_ROUTE}?redirect=${encodeURIComponent(
            currentUrl
          )}`;

          if (process.env.NODE_ENV === 'development') {
            console.log('[HTTP Client] Redirecting to login:', loginUrl);
          }

          window.location.href = loginUrl;

          return Promise.reject(error);
        }
      }

      // Handle Network Errors
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
