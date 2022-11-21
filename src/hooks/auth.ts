import { useEffect } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';

import axios from '@/lib/axios';
import { httpClientAuth } from '@/lib/http';

type useAuthProps = {
  middleware?: string;
  redirectIfAuthenticated?: string;
};

export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: useAuthProps = {}) => {
  const router = useRouter();

  const {
    data: user,
    error,
    mutate,
  } = useSWR('/api/user', () =>
    httpClientAuth
      .get('/api/user')
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;

        router.push('/verify-email');
      })
  );

  const csrf = () => axios.get('/sanctum/csrf-cookie');

  const register = async ({ setErrors, ...props }) => {
    await csrf();

    setErrors([]);

    axios
      .post('/register', props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(Object.values(error.response.data.errors).flat());
      });
  };

  const login = async ({ setErrors, setStatus, ...props }) => {
    const csrfToken = await csrf();

    setErrors([]);
    setStatus(null);

    // Get the XSRF Token and set to header
    const xSRFToken = csrfToken.config.headers['X-XSRF-TOKEN'] ?? '';

    const headers = {
      'X-XSRF-TOKEN': xSRFToken,
    };
    const config = {
      headers: headers,
    };
    axios
      .post('/login', props, config)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(Object.values(error.response.data.errors).flat());
      });
  };

  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post('/forgot-password', { email })
      .then((response) => setStatus(response.data.status))
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(Object.values(error.response.data.errors).flat());
      });
  };

  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post('/reset-password', { token: router.query.token, ...props })
      .then((response) =>
        router.push(
          '/login?reset=' + Buffer.from(response.data.status, 'base64')
        )
      )
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(Object.values(error.response.data.errors).flat());
      });
  };

  const resendEmailVerification = ({ setStatus }) => {
    axios
      .post('/email/verification-notification')
      .then((response) => setStatus(response.data.status));
  };

  const logout = async (redirect = null) => {
    if (!error) {
      await axios.post('/logout').then(() => mutate());
    }

    return (window.location.pathname = `/login`);
  };

  const securePaths = [
    'dashboard',
    'dashboard/posts',
    'dashboard/titles',
    'dashboard/events',
    'dashboard/companies',
    'dashboard/users',
    'dashboard/people',
    'perfil',
    'mi-lista',
  ];

  const pathname = router.pathname.split('/')[1];

  const onLogout = () => {
    if (securePaths.includes(pathname)) {
      const redirectWhenAuthenticated = router.asPath;
      return logout(redirectWhenAuthenticated);
    }
    return logout();
  };

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);
    if (middleware === 'auth' && error && securePaths.includes(pathname))
      onLogout();
  }, [user, error]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  };
};
