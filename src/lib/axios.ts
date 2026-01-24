import { LOGIN_ROUTE } from '@/constants/common';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { signOut } from 'next-auth/react';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

// Add an interceptor to redirect to the login page if the server responds with a 401 (unauthorized)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;

      // Avoid infinite loop if already on login page
      if (currentPath !== LOGIN_ROUTE) {
        // Save the current URL (pathname + search) to redirect after login
        const currentUrl = window.location.pathname + window.location.search;

        // Store the URL in sessionStorage to redirect after login
        sessionStorage.setItem('redirectAfterLogin', currentUrl);

        // Clear any existing session data
        try {
          // Clear NextAuth session
          await signOut({
            redirect: false, // We'll handle redirect manually
          });
        } catch (signOutError) {
          // If signOut fails, continue anyway
          console.error('[Axios Instance] Error during signOut:', signOutError);
        }

        // Redirect to login with the redirect parameter
        const loginUrl = `${LOGIN_ROUTE}?redirect=${encodeURIComponent(
          currentUrl
        )}`;
        window.location.href = loginUrl;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
