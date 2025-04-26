import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    Origin: process.env.NEXT_PUBLIC_API_URL,
  },
  withCredentials: true,
});

axios.defaults.withCredentials = true;

// Interceptor para agregar el token CSRF a cada solicitud
axios.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (token) {
    config.headers['XSRF-TOKEN'] = token;
  }

  return config;
});

export default axios;
