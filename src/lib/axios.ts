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

export default axios;
